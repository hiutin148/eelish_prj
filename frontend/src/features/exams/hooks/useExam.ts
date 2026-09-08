import { useEffect, useState } from 'react'
import { examQuestions } from '../data/exams'

export function useExam() {
  const [started, setStarted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [seconds, setSeconds] = useState(20 * 60)
  useEffect(() => { if (!started || submitted || seconds === 0) return undefined; const timer = window.setInterval(() => setSeconds((current) => Math.max(current - 1, 0)), 1000); return () => window.clearInterval(timer) }, [started, submitted, seconds])
  const start = () => { setStarted(true); setSubmitted(false); setIndex(0); setAnswers({}); setSeconds(20 * 60) }
  const score = examQuestions.reduce((total, question, questionIndex) => total + (answers[questionIndex] === question.answer ? 1 : 0), 0)
  return { questions: examQuestions, started, submitted, index, answers, seconds, score, setIndex, setAnswers, setSubmitted, start }
}