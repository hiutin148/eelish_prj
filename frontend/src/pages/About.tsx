import { Card } from '../components/ui/Card'
export function About() {
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">About</p>
          <h1>Make learning feel lighter.</h1>
        </div>
      </div>
      <Card className="about-copy">
        <p>
          Eelish is a focused vocabulary workspace. This page is an example route, while the folders
          around it show where shared UI, feature logic, API calls and app-level concerns live.
        </p>
        <p className="muted">
          Keep page components concerned with composition. Put reusable behavior in hooks, domain
          behavior in features, and network configuration in services.
        </p>
      </Card>
    </>
  )
}
