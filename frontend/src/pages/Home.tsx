import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { TodoList } from '../features/todos'
import { formatDate } from '../lib/formatDate'
export function Home() {
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">{formatDate(new Date())}</p>
          <h1>Good morning, Minh.</h1>
          <p className="muted">A small, steady session beats a perfect plan.</p>
        </div>
        <Button>+ New deck</Button>
      </div>
      <div className="stats-grid">
        <Card className="stat-card">
          <span className="stat-label">Cards reviewed</span>
          <strong>128</strong>
          <span className="muted">+18% this week</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-label">Current streak</span>
          <strong>
            07 <small>days</small>
          </strong>
          <span className="muted">Best: 14 days</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-label">Accuracy</span>
          <strong>86%</strong>
          <span className="muted">Across 4 decks</span>
        </Card>
      </div>
      <div className="feature-grid">
        <Card className="study-card">
          <p className="eyebrow">Up next · 12 cards</p>
          <h2>Essential English Words</h2>
          <p>Keep your momentum going with a quick review of your active vocabulary.</p>
          <div className="progress-track">
            <span />
          </div>
          <div className="study-actions">
            <Button>Continue study</Button>
            <Button variant="secondary">View deck</Button>
          </div>
        </Card>
        <Card>
          <div className="panel-header">
            <h2>Recent activity</h2>
          </div>
          <ul className="activity-list">
            <li>
              <span>Completed Lesson 03</span>
              <small>Today</small>
            </li>
            <li>
              <span>Added 24 new cards</span>
              <small>Yesterday</small>
            </li>
            <li>
              <span>Started a 7 day streak</span>
              <small>2 days ago</small>
            </li>
          </ul>
        </Card>
      </div>
      <div style={{ marginTop: 22 }}>
        <TodoList />
      </div>
    </>
  )
}
