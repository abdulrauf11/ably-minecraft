import { useCallback, useState } from 'react'
import { useTexture } from '@react-three/drei'
import { useBox } from '@react-three/cannon'
import create from 'zustand'
import { useChannel } from '@ably-labs/react-hooks'

function arrayAlreadyHasArray(arr, subarr) {
  for (let i = 0; i < arr.length; i++) {
    let checker = false
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] === subarr[j]) {
        checker = true
      } else {
        checker = false
        break
      }
    }
    if (checker) {
      return true
    }
  }
  return false
}

// This is a super naive implementation and wouldn't allow for more than a few thousand boxes.
// In order to make this scale this has to be one instanced mesh, then it could easily be
// hundreds of thousands.

const useCubeStore = create((set) => ({
  cubes: [],
  addCube: (x, y, z) =>
    set((state) => ({ cubes: [...state.cubes, [x, y, z]] })),
}))

export const Cubes = () => {
  const cubes = useCubeStore((state) => state.cubes)
  const addCube = useCubeStore((state) => state.addCube)

  const [channel] = useChannel('game', (message) => {
    const { x, y, z } = message.data
    addCube(x, y, z)
  })

  function publishCube(x, y, z) {
    channel.publish('new-cube', { x, y, z })
  }

  return cubes.map((coords, index) => (
    <Cube key={index} position={coords} publishCube={publishCube} />
  ))
}

export const Cube = ({ position, publishCube = null }) => {
  const [ref] = useBox(() => ({ type: 'Static', position }))
  const [hover, set] = useState(null)
  const addCube = useCubeStore((state) => state.addCube)
  const texture = useTexture('/assets/dirt.jpg')
  const onMove = useCallback(
    (e) => (e.stopPropagation(), set(Math.floor(e.faceIndex / 2))),
    []
  )
  const onOut = useCallback(() => set(null), [])
  const onClick = useCallback((e) => {
    e.stopPropagation()
    const { x, y, z } = ref.current.position
    const dir = [
      [x + 1, y, z],
      [x - 1, y, z],
      [x, y + 1, z],
      [x, y - 1, z],
      [x, y, z + 1],
      [x, y, z - 1],
    ]

    if (publishCube) publishCube(...dir[Math.floor(e.faceIndex / 2)])
    else addCube(...dir[Math.floor(e.faceIndex / 2)])
  }, [])

  return (
    <mesh
      ref={ref}
      receiveShadow
      castShadow
      onPointerMove={onMove}
      onPointerOut={onOut}
      onClick={onClick}
    >
      {[...Array(6)].map((_, index) => (
        <meshStandardMaterial
          attach={`material-${index}`}
          key={index}
          map={texture}
          color={hover === index ? 'hotpink' : 'white'}
        />
      ))}
      <boxGeometry />
    </mesh>
  )
}
