"use client"

import { useInView } from "react-intersection-observer"
import CountUp from "react-countup"

interface AnimatedCounterProps {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

export function AnimatedCounter({ 
  end, 
  suffix = "", 
  prefix = "",
  duration = 2,
  className = ""
}: AnimatedCounterProps) {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  return (
    <span ref={ref} className={className}>
      {inView ? (
        <CountUp
          end={end}
          duration={duration}
          suffix={suffix}
          prefix={prefix}
          separator=","
        />
      ) : (
        `${prefix}0${suffix}`
      )}
    </span>
  )
}
