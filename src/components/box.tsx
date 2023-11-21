// ThreeBox.tsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeBox: React.FC = () => {
  const mount = useRef<HTMLDivElement | null>(null);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  );

  useEffect(() => {
    if (!mount.current) return;

    // Set up scene, camera, and renderer
    camera.position.z = 5;
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.current.appendChild(renderer.domElement);
    scene.add(cube);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Handle mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      const vector = new THREE.Vector3(mouseX, mouseY, 0.5);
      vector.unproject(camera);

      const raycaster = new THREE.Raycaster(
        camera.position,
        vector.sub(camera.position).normalize()
      );
      const intersects = raycaster.intersectObject(cube);

      if (intersects.length > 0) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      renderer.render(scene, camera);
    };

    animate();

    // Clean up on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);

      if (mount.current && renderer) {
        mount.current.removeChild(renderer.domElement);
      }
    };
  }, [cube, scene, camera, renderer]);

  return <div ref={mount}></div>;
};

export default ThreeBox;
