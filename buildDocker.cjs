const { spawn, exec } = require('child_process');

let imageName = 'manager-web-image';
let containerName = 'manager-frontend';
let outerPort = 8089;
let innerPort = 80;

const args = process.argv.slice(2); // 去掉前两个参数(node路径和脚本路径)

// 现在args数组包含了传递给脚本的参数，例如：['--name=GitHubCopilot']
args.forEach(arg => {
  const [key, value] = arg.split('=');
  if (key === '--name') {
    imageName = value;
  } else if (key === '--container') {
    containerName = value;
  } else if (key === '--outerPort') {
    outerPort = value;
  } else if (key === '--innerPort') {
    innerPort = value;
  }
});

console.log('运行npm run build...');

const buildProcess = spawn('npm', ['run', 'build'], { stdio: 'inherit' });
buildProcess.on('close', code => {
  if (code !== 0) {
    console.error(`npm run build failed with code ${code}`);
    process.exit(1)
  }
  console.log('npm run build 完成');
  console.log('开始构建 Docker 镜像...');
  exec(`docker build -t ${imageName} .`, (dockerBuildError, dockerBuildStdout, dockerBuildStderr) => {
      if (dockerBuildError) {
        console.error(`Docker build error: ${dockerBuildError}`);
        process.exit(1)
      }
      console.log('Docker build 完成');
      console.log(dockerBuildStdout)
      console.log('开始检测是否已存在指定名称的Docker容器...')
      // Step 3: 检测是否已存在指定名称的Docker容器
      exec(`docker ps -a --filter "name=^/${containerName}$" --format "{{.Names}}"`, (psError, psStdout, psStderr) => {
        if (psError) {
          console.error(`Docker ps error: ${psError}`);
          process.exit(1)
        }
        console.log(psStdout)
        console.log('检测完成')
        if (psStdout.trim()) {
          console.log('已存在指定名称的Docker容器, 准备停止并删除...')
          // 如果容器存在，停止并删除容器
          exec(`docker stop ${containerName} && docker rm ${containerName}`, (stopError, stopStdout, stopStderr) => {
            if (stopError) {
              console.error(`Docker stop/rm error: ${stopError}`);
              process.exit(1)
            }
            console.log(stopStdout)
            console.log('已停止并删除现有容器');
            runDockerImage();
          });
        } else {
          runDockerImage();
        }
      });
    });
  
})

function runDockerImage() {
  console.log('开始运行 Docker 镜像...');
  // Step 4: 运行 Docker 镜像
  exec(`docker run -d --name ${containerName} -p ${outerPort}:${innerPort} ${imageName}`, (dockerRunError, dockerRunStdout, dockerRunStderr) => {
    if (dockerRunError) {
      console.error(`Docker run error: ${dockerRunError}`);
      process.exit(1)
    }
    console.log(dockerRunStdout)
    console.log('Docker run 完成');
  });
}