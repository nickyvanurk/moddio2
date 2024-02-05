class ThreeCamera {
	instance: THREE.Camera;
	isPerspective = false;

	private orthographicCamera: THREE.OrthographicCamera;
	private perspectiveCamera: THREE.PerspectiveCamera;
	private controls: OrbitControls;

	private orthographicState: { target: THREE.Vector3; position: THREE.Vector3 };
	private perspectiveState: { target: THREE.Vector3; position: THREE.Vector3; zoom: number };

	constructor(
		private viewportWidth: number,
		private viewportHeight: number,
		canvas: HTMLCanvasElement
	) {
		const persCamera = new THREE.PerspectiveCamera(75, viewportWidth / viewportHeight, 0.1, 1000);
		persCamera.position.y = 20;
		this.perspectiveCamera = persCamera;

		const halfWidth = frustumWidthAtDistance(this.perspectiveCamera, persCamera.position.y) / 2;
		const halfHeight = frustumHeightAtDistance(this.perspectiveCamera, persCamera.position.y) / 2;
		const orthoCamera = new THREE.OrthographicCamera(-halfWidth, halfWidth, halfHeight, -halfHeight, 0.1, 1000);
		orthoCamera.position.y = 20;
		this.orthographicCamera = orthoCamera;

		this.instance = orthoCamera;

		this.controls = new OrbitControls(this.instance, canvas);
		this.controls.enableRotate = false;
		this.controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: '' };
		this.controls.update();

		this.orthographicState = {
			target: new THREE.Vector3(),
			position: new THREE.Vector3(),
		};
		this.perspectiveState = {
			target: new THREE.Vector3(),
			position: new THREE.Vector3(),
			zoom: this.controls.zoom,
		};

		window.addEventListener('keypress', (evt) => {
			if (evt.key === 'v') {
				this.isPerspective = !this.isPerspective;

				if (this.isPerspective) {
					this.switchToPerspectiveCamera();
				} else {
					this.switchToOrthographicCamera();
				}
			}
		});
	}

	update() {
		if (this.controls.enableRotate) {
			this.controls.update();
		}
	}

	resize() {
		if (this.instance instanceof THREE.PerspectiveCamera) {
			this.instance.aspect = this.viewportWidth / this.viewportHeight;
			this.instance.updateProjectionMatrix();
		} else if (this.instance instanceof THREE.OrthographicCamera) {
			this.instance.left = this.viewportWidth / -2;
			this.instance.right = this.viewportWidth / 2;
			this.instance.top = this.viewportHeight / 2;
			this.instance.bottom = this.viewportHeight / -2;
			this.instance.updateProjectionMatrix();
		}
	}

	setPosition2D(x: number, z: number) {
		const oldTarget = this.controls.target.clone();
		this.controls.target.set(x, this.controls.target.y, z);
		const diff = this.controls.target.clone().sub(oldTarget);

		this.orthographicCamera.position.add(diff);
		this.perspectiveCamera.position.add(diff);
	}

	private switchToOrthographicCamera() {
		this.controls.enableRotate = false;

		this.perspectiveState.target.copy(this.controls.target);
		this.perspectiveState.position.copy(this.controls.object.position);
		this.perspectiveState.zoom = this.controls.object.zoom;

		const distance = this.perspectiveCamera.position.distanceTo(this.controls.target);
		const halfWidth = frustumWidthAtDistance(this.perspectiveCamera, distance) / 2;
		const halfHeight = frustumHeightAtDistance(this.perspectiveCamera, distance) / 2;
		this.orthographicCamera.top = halfHeight;
		this.orthographicCamera.bottom = -halfHeight;
		this.orthographicCamera.left = -halfWidth;
		this.orthographicCamera.right = halfWidth;
		this.orthographicCamera.zoom = 1; // don't touch. makes sure camera seamless transition between pers/ortho when zoomed.
		this.orthographicCamera.lookAt(this.controls.target);
		this.orthographicCamera.updateProjectionMatrix();
		this.instance = this.orthographicCamera;
		this.controls.object = this.orthographicCamera;

		if (this.orthographicState.target && this.orthographicState.position) {
			this.controls.target.copy(this.orthographicState.target);
			this.controls.object.position.copy(this.orthographicState.position).divideScalar(this.orthographicCamera.zoom);
			this.controls.update();
		}
	}

	private switchToPerspectiveCamera() {
		this.controls.enableRotate = true;

		this.orthographicState.target.copy(this.controls.target);
		this.orthographicState.position.copy(this.controls.object.position);

		this.perspectiveCamera.updateProjectionMatrix();
		this.instance = this.perspectiveCamera;
		this.controls.object = this.perspectiveCamera;

		if (this.perspectiveState.target && this.perspectiveState.position && this.perspectiveState.zoom) {
			this.controls.target.copy(this.perspectiveState.target);
			this.controls.object.position.copy(this.perspectiveState.position).divideScalar(this.orthographicCamera.zoom);
			this.controls.object.zoom = this.perspectiveState.zoom;
			this.controls.update();
		}
	}
}

function frustumHeightAtDistance(camera: THREE.PerspectiveCamera, distance: number) {
	// Fov formula: http://www.artdecocameras.com/resources/angle-of-view/
	const angle = (camera.fov * Math.PI) / 180; // camera.fov is vertical fov.
	return Math.tan(angle / 2) * distance * 2;
}

function frustumWidthAtDistance(camera: THREE.PerspectiveCamera, distance: number) {
	return frustumHeightAtDistance(camera, distance) * camera.aspect;
}
