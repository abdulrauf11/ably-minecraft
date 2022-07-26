import Overlay from '@/components/dom/Overlay'
import { Sky, PointerLockControls } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import Ground from '@/components/canvas/Ground'
import Player from '@/components/canvas/Player'
import { Cube, Cubes } from '@/components/canvas/Cube'
import Participants from '@/components/dom/Participants'

// dom components goes here
const Page = (props) => {
  return (
    <>
      <Overlay />
      <Participants />
    </>
  )
}

// canvas components goes here
// It will receive same props as Page component (from getStaticProps, etc.)
Page.r3f = (props) => {
  return (
    <>
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={0.3} />
      <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
      <Physics gravity={[0, -30, 0]}>
        <Ground />
        <Player />
        <Cube position={[0, 0.5, -10]} />
        <Cubes />
      </Physics>
      <PointerLockControls />
    </>
  )
}

export default Page

export async function getStaticProps() {
  return {
    props: {
      title: 'Index',
    },
  }
}
