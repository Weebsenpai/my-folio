import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { GLTFLoader } from 'three-stdlib';
import gsap from 'gsap';
import { skills } from 'src/assets/data/mydata';
import { DRACOLoader } from 'three-stdlib';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  skills = ['Angular', 'Three.js', 'JavaScript', 'TypeScript', 'CSS', 'HTML'];

  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;
  @ViewChild('skillsUnInteractive', {static: true}) normalSkillContainer!: ElementRef;
  @ViewChildren('gridDiv') gridDiv!: QueryList<ElementRef>;

  isModalVisible = false;

  scene = new THREE.Scene();
  camera!: THREE.PerspectiveCamera;
  private mixer!: THREE.AnimationMixer;
  private clock = new THREE.Clock();
  raycaster = new THREE.Raycaster();
  renderer!: THREE.WebGLRenderer;
  mouse = new THREE.Vector2();
  gltfModel!: THREE.Group;
  spotlight!: THREE.SpotLight;
  controls!: OrbitControls
  disableSingleClick = true;
  switchToNormal: boolean = false;
  normalSkillView = skills
  normalViewDivCSS = "border-2 rounded-xl flex items-center justify-center flex-col p-2";
  skillName: string = "";
  skillDescription: string = "";
  directionalLightArray: THREE.Vector3[] = [new THREE.Vector3(0,10,0),new THREE.Vector3(0,-10,0),new THREE.Vector3(10,0,0),
    new THREE.Vector3(-10,0,0),new THREE.Vector3(0,0,10),new THREE.Vector3(0,0,-10)]
  cameraRestting: boolean = false

  savedCamerPosition: THREE.Vector3 = new THREE.Vector3(0,0,0);
  originalCameraPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 30);
  targetCameraPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 30);

  constructor() { gsap.registerPlugin()}
  

  ngOnInit(): void {
    this.normalSkillContainer.nativeElement.style.display = 'none';
    this.createThreeJsBox();
    //this.removeInterativeSphere()
    this.renderer.domElement.addEventListener('dblclick', (event) => this.onDoubleClick(event));
    this.renderer.domElement.addEventListener('click', (event) => this.onClick(event));
  }

  createThreeJsBox(): void {
    //const scene = new THREE.Scene();

    const canvasSizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.camera = new THREE.PerspectiveCamera(75,canvasSizes.width / canvasSizes.height,1,50);
    this.camera.position.copy(this.originalCameraPosition);
    this.scene.add(this.camera);


    const ambientLight = new THREE.AmbientLight(0x404040, 0); // Low intensity
    this.scene.add(ambientLight);

    // this.directionalLightArray.forEach((vector: THREE.Vector3) => {
    //   const light = new THREE.DirectionalLight(0xffffff,0.2);
    //   light.position.copy(vector);
    //   this.scene.add(light);
    // });

    

    this.spotlight = new THREE.SpotLight(0xffffff, 1200);
    this.spotlight.position.set(0, 10, 0); // Initial position of the spotlight
    this.spotlight.target.position.set(0,0,0);
    this.scene.add(this.spotlight.target);
    this.spotlight.target.updateMatrixWorld();
    this.spotlight.angle = Math.PI / 6.5; // Narrow angle for focus effect
    this.spotlight.penumbra = 1; // Soft edges around the spotlight
    this.spotlight.decay = 1.5; // Light decay for natural falloff
    this.spotlight.distance = 1000; // How far the light reaches
    this.scene.add(this.spotlight);
    this.spotlight.castShadow = true;

    this.spotlight.shadow.mapSize.width = 4096;  // Increase shadow resolution
    this.spotlight.shadow.mapSize.height = 4096;
    this.spotlight.shadow.camera.near = 0.5;     // Near clipping plane
    this.spotlight.shadow.camera.far = 70;       // Far clipping plane
    this.spotlight.shadow.camera.fov = 30;




  
    this.renderer = new THREE.WebGLRenderer({antialias: true,alpha: true});
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
    this.renderer.shadowMap.enabled = true; 
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(canvasSizes.width, canvasSizes.height);

    if (!this.rendererContainer) {
      return;
    }

    // const progressBarContainer = document.createElement('div');
    // progressBarContainer.style.position = 'absolute';
    // progressBarContainer.style.top = '0';
    // progressBarContainer.style.left = '0';
    // progressBarContainer.style.width = '100%';
    // progressBarContainer.style.height = '5px';
    // progressBarContainer.style.backgroundColor = '#ccc';
    // this.rendererContainer.nativeElement.appendChild(progressBarContainer);

    // const progressBar = document.createElement('div');
    // progressBar.style.width = '0';
    // progressBar.style.height = '100%';
    // progressBar.style.backgroundColor = '#4caf50';
    // progressBarContainer.appendChild(progressBar);

    const loadingText = document.getElementById('loading-text');
    const loadingPercentage = document.getElementById('loading-percentage');

    this.rendererContainer.nativeElement.style.display = 'none';


    const model = 'assets/models/planet_compressed.glb'
    const dracoLoader = new DRACOLoader();  
    dracoLoader.setDecoderPath('assets/jsm/libs/draco/');
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    const material = new THREE.MeshStandardMaterial()
    gltfLoader.load(model, (gltf) => {
      this.gltfModel = gltf.scene;
      gltf.scene.traverse((child: any) => {
        if(child.isMesh && child.name === "Sphere"){
          child.receiveShadow = true;
        }
        if(child.isMesh){
          child.castShadow = true
          if(child.name === "Sphere"){
            child.castShadow = false;
          }
          child.material = child.material;
          this.mixer = new THREE.AnimationMixer(gltf.scene);

          const animation = gltf.animations[0]; // Assume first animation
          if (animation) {
            const action = this.mixer.clipAction(animation);
            action.play();
          }
        }
        else {
          child.material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        }
      });
      gltf.scene.scale.set(13,13,13);
      this.scene.add(gltf.scene)
      if (loadingText) loadingText.style.display = 'none';
      this.rendererContainer.nativeElement.style.display = 'block';

      const normal_btn = document.getElementsByClassName('normal-btn-div').item(0) as HTMLElement
      normal_btn.style.display = 'block';

    },(xhr) => {
      // Update the progress bar based on loading percentage
      // const percentComplete = (xhr.loaded / xhr.total) * 100;
      // progressBar.style.width = percentComplete + '%';

      const percentComplete = (xhr.loaded / xhr.total) * 100;
      if (loadingPercentage) {
        loadingPercentage.innerText = `${Math.round(percentComplete)}%`;
      }
    });
    

    this.controls = new OrbitControls(this.camera,this.renderer.domElement);
    this.controls.enableDamping = true; // enables smooth rotation
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 30
    this.controls.maxDistance = 50
    
    this.controls.addEventListener('change', () => {
      // Sync the spotlight position with the camera
      if(!this.cameraRestting){
        this.spotlight.position.copy(this.camera.position);
        this.spotlight.target.position.copy(this.controls.target);
        ambientLight.intensity = 1;
        this.spotlight.target.updateMatrixWorld();
      } 
    });

    window.addEventListener('resize', () => {
      canvasSizes.width = window.innerWidth;
      canvasSizes.height = window.innerHeight;

      this.camera.aspect = canvasSizes.width / canvasSizes.height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(canvasSizes.width, canvasSizes.height);
      this.renderer.render(this.scene, this.camera);
    });

    const animateGeometry = () => {

      const delta = this.clock.getDelta();
      if (this.mixer) this.mixer.update(delta);
      this.renderer.render(this.scene, this.camera);
      window.requestAnimationFrame(animateGeometry);
    };

    animateGeometry();
  }

  onDoubleClick(event: MouseEvent): void {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Use raycaster to check if the user clicked on the model
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.gltfModel, true); // true to check children

    if (intersects.length > 0) {
      // Get the intersection point
      this.disableSingleClick = false;
      const intersectPoint = intersects[0].point;
      this.savedCamerPosition.copy(this.camera.position.clone());
      this.controls.enabled = false;
      // Calculate a new camera position a small distance away from the intersected point
      const cameraTargetPosition = new THREE.Vector3();
      const distance = 5; // Distance to stay away from the clicked point
      const direction = new THREE.Vector3().subVectors(this.camera.position, intersectPoint).normalize();

      // Move back along the direction from the intersected point
      cameraTargetPosition.copy(intersectPoint).add(direction.multiplyScalar(distance));


      gsap.to(this.spotlight,{
        intensity: 500,
        duration: 2,
        ease: 'power2.inOut'
      });
      // Animate camera movement using GSAP on double-click
      gsap.to(this.camera.position, {
        x: cameraTargetPosition.x,
        y: cameraTargetPosition.y,
        z: cameraTargetPosition.z,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: () => {
          // Update the camera to look at the intersected point during animation
          this.camera.lookAt(intersectPoint);

          this.spotlight.position.copy(this.camera.position);
          this.spotlight.position.x += 5;
          this.spotlight.position.y += 5;
          this.spotlight.position.z += 5;
          this.spotlight.target.position.copy(intersectPoint);
          this.scene.add(this.spotlight.target);
          // this.spotlight.intensity = 500;
          this.spotlight.target.updateMatrixWorld();
        },
      });
    }
  }

  onClick(event: MouseEvent): void {
    if(this.disableSingleClick){
      return;
    }
    // Convert mouse position to normalized device coordinates (-1 to +1)
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Use raycaster to check if the user clicked on the model
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.gltfModel, true); // true to check children

    // If no intersections, reset the camera
    if (intersects.length === 0) {
      // Animate camera back to the original position
      this.cameraRestting = true;

      // const currentPosition = this.camera.position.clone();
      // const originalPosition = new THREE.Vector3(0, 0, 30);

      gsap.to(this.camera.position, {
        x: this.savedCamerPosition.x,
        y: this.savedCamerPosition.y,
        z: this.savedCamerPosition.z,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: () => {
          this.camera.lookAt(new THREE.Vector3(0, 0, 0));
          this.spotlight.position.set(0,10,0);
          this.spotlight.target.position.set(0,0,0);
          this.scene.add(this.spotlight.target);
          this.spotlight.target.updateMatrixWorld();
          this.spotlight.intensity = 1200;
          //this.updateSpotlightPosition('single',new THREE.Vector3(0,10,0));
        },
        onComplete: ()=>{
          this.cameraRestting = false;
          this.spotlight.position.set(0,10,0);
          this.spotlight.target.position.set(0, 0, 0);  // Focus on the center
          this.spotlight.target.updateMatrixWorld(); 
          this.controls.enabled = true;
          this.spotlight.intensity = 1200;
          this.controls.update();  // Ensure controls update with the camera and spotlight
          this.renderer.render(this.scene, this.camera);
          this.disableSingleClick = true;
        }
      });
    }
  }

  removeInterativeSphere(){
    this.switchToNormal = !this.switchToNormal
    if(this.switchToNormal){
      gsap.to(this.rendererContainer.nativeElement,{
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        onComplete: ()=> {
          this.rendererContainer.nativeElement.style.display = 'none';
          const normal_btn = document.getElementsByClassName('normal-btn').item(0) as HTMLElement
          normal_btn.innerHTML = 'Switch to 3D';
          this.renderNormalDiv();
        }
      });
    }if(!this.switchToNormal){
      this.normalSkillContainer.nativeElement.style.display = 'none';
      this.rendererContainer.nativeElement.style.display = 'block';
      gsap.to(this.rendererContainer.nativeElement,{
        opacity: 1,
        duration: 1,
        ease: 'power2.in',
        onComplete: ()=> {
          const normal_btn = document.getElementsByClassName('normal-btn').item(0) as HTMLElement
          normal_btn.innerHTML = 'Switch to Normal';
        }
      });
    }
  }

  renderNormalDiv(){
    this.normalSkillContainer.nativeElement.style.display = 'block';
    const firstDone: boolean = false;
    this.gridDiv.forEach((ele, index)=>{
      if(index == 0){
        gsap.fromTo(ele.nativeElement,{
          y: -200,
          opacity: 0
        },{
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power1.out',
        });
      }
      if(index === 5 || index === 9){
        gsap.fromTo(ele.nativeElement,{
          x: -200,
          opacity: 0
        },{
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        });
      }
      if(index === 1){
        gsap.fromTo(ele.nativeElement,{
          x: -200,
          opacity: 0
        },{
          x: 0,
          opacity: 1,
          delay: 1,
          duration: 1,
          ease: 'power2.out',
        });
      }
      if(index === 6){
        gsap.fromTo(ele.nativeElement,{
          y: 200,
          opacity: 0
        },{
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        });
      }
      if(index === 7){
        gsap.fromTo(ele.nativeElement,{
          x: -100,
          opacity: 0
        },{
          x: 0,
          opacity: 1,
          duration: 1,
          delay: 1,
          ease: 'power2.out',
        });
      }
      if(index === 4){
        gsap.fromTo(ele.nativeElement,{
          x: 200,
          opacity: 0
        },{
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        });
      }
      if(index === 8){
        gsap.fromTo(ele.nativeElement,{
          y: 200,
          opacity: 0
        },{
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        });
      }
      if(index === 3){
        gsap.fromTo(ele.nativeElement,{
          x: 100,
          opacity: 0
        },{
          x: 0,
          delay: 1,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        });
      }
      if(index === 2){
        gsap.fromTo(ele.nativeElement,{
          opacity: 0,
          scale: 0
        },{
          scale: 1,
          delay: 2,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        });
      }
      if(index === 10){
        gsap.fromTo(ele.nativeElement,{
          opacity: 0,
          x: -100
        },{
          x: 0,
          delay: 1,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        });
      }
      if(index === 14){
        gsap.fromTo(ele.nativeElement,{
          opacity: 0,
          x: 100
        },{
          x: 0,
          delay: 1,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        });
      }
      if(index === 11 || index === 12 || index === 13){
        gsap.fromTo(ele.nativeElement,{
          opacity: 0,
          y: 100
        },{
          y: 0,
          delay: 2.1,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        });
      }
      if(index > 14){
        gsap.fromTo(ele.nativeElement,{
          opacity: 0,
          x : -100*(index*0.1)
        },{
          x: 0,
          duration: 3,
          delay: 1,
          opacity: 1,
          stagger: 1,
          ease: 'power2.out'
        });
      }
    });
  }

  onHover(event: Event) {
    const target = event.target as HTMLElement;
    gsap.to(target, {
      background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.3))',
      color: 'black',
      duration: 0.5,
      border: '2px solid black',
      scale: 1.07,
    });
  }

  onLeave(event: Event) {
    const target = event.target as HTMLElement;
    gsap.to(target, {
      background: 'transparent',
      color: 'white',
      duration: 0.5,
      border: '2px solid white',
      scale: 1
    });
  }

  openModal(skill: string,description: string, index: number) {
    if(index < 11){
      this.isModalVisible = true;
      this.skillDescription = description
      this.skillName = skill;
    }
  }

  closeModal() {
    this.isModalVisible = false;
  }

  // updateSpotlightPosition(clickType: string, points: THREE.Vector3){
  //   if(clickType === 'double'){

  //   }
  //   if(clickType === 'single'){
  //     this.spotlight.target.position.copy(points);
  //   }
  // }

}

export class skillModel {
  skillName!: string;
}