document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('container');

    // Three.jsの基本設定
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // カメラの映像を表示するためのビデオ要素
    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(error => console.error('カメラへのアクセスに失敗しました:', error));

    // 3Dモデルのロード
    const loader = new THREE.GLTFLoader();
    let model;

    loader.load('path-to-your-3d-model.glb', (gltf) => {
        model = gltf.scene;
        scene.add(model);
    });

    // MindARの初期化
    const mindarThree = new AR.MindARThree({
        container: document.getElementById('container'),
        imageTargetSrc: 'path-to-your-image-target.png' // 画像ターゲットのパス
    });
    await mindarThree.start();

    // マーカーの追跡開始
    const { three } = mindarThree;
    three.addAnchor(0, () => {
        if (model) {
            model.visible = true; // モデルを表示
            model.position.set(0, 0, -1); // z座標を調整して適切な位置に配置
        }
    });

    function animate() {
        requestAnimationFrame(animate);
        mindarThree.update();
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
