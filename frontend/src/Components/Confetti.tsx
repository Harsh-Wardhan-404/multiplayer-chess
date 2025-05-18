import React from 'react'
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'

export const ConfettiEffect = () => {
  const { width, height } = useWindowSize()
  return (
    <Confetti recycle={false}
      width={width}
      height={height}
    />
  )
}
