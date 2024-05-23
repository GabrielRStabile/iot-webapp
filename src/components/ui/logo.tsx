import fullLogo from '../../assets/full_logo.svg'
import reducedLogo from '../../assets/reduced_logo.svg'

export default function Logo({ reduced = false }) {
  return (
    <img
      src={reduced ? reducedLogo : fullLogo}
      alt="IoT App"
      draggable={false}
    />
  )
}
