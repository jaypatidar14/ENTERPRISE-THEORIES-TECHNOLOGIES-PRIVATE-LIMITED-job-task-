import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ message: 'Route not found.' })
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: error.issues[0]?.message ?? 'Validation failed.',
      issues: error.issues,
    })
    return
  }

  if (error instanceof Error) {
    res.status(500).json({ message: error.message })
    return
  }

  res.status(500).json({ message: 'Internal server error.' })
}
