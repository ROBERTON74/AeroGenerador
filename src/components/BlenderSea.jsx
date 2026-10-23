import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MODEL_SCALE } from './blenderTurbineModel.js';
import { loadBlenderSea } from './blenderSea.js';

export default function BlenderSea({ fallback, reducedMotion = false, onStatusChange }) {
  const { gl } = useThree();
  const seaRef = useRef(null);
  const [sea, setSea] = useState(null);
  const [failed, setFailed] = useState(false);
  const reportedReady = useRef(false);
  useEffect(() => {
    const abort = new AbortController();let active = true;
    gl.domElement.dataset.seaModel = 'loading';
    setFailed(false);reportedReady.current = false;
    onStatusChange?.('loading');
    loadBlenderSea({ scale: MODEL_SCALE * 1.2, height: -.08, signal: abort.signal }).then(group => {
      if (!active) { group.dispose();return; }
      seaRef.current = group;setSea(group);gl.domElement.dataset.seaModel = 'blender';
      gl.domElement.dataset.seaSpeed = '0.75';
    }).catch(error => {
      if (!active) return;
      gl.domElement.dataset.seaModel = 'fallback';
      setFailed(true);onStatusChange?.('error');
      console.error('No se pudo cargar el mar de Blender; se conserva el mar anterior.', error);
    });
    return () => {
      active = false;abort.abort();seaRef.current?.dispose();seaRef.current = null;
      delete gl.domElement.dataset.seaModel;delete gl.domElement.dataset.seaSpeed;delete gl.domElement.dataset.seaTime;
    };
  }, [gl, onStatusChange]);
  useFrame(({ camera }, delta) => {
    if (!seaRef.current || !sea) return;
    if (!reportedReady.current) {
      reportedReady.current = true;onStatusChange?.('ready');
    }
    seaRef.current.update(Math.min(delta, .25), !reducedMotion && !document.hidden, camera.position);
    gl.domElement.dataset.seaTime = String(seaRef.current.userData.seaTime);
  });
  return sea ? <primitive object={sea} dispose={null} /> : failed ? fallback : null;
}
