import { Mesh, PlaneBufferGeometry } from "three";
function Plane(props) {
  return (
    <mesh receiveShadow rotation-x={-Math.PI / 2} position={props.position}>
      <planeBufferGeometry args={[10, 10]} />
      <meshStandardMaterial color="grey" />
      {props.children}
    </mesh>
  );
}

export default Plane;
