export type LoginPayload = { email: string; password: string }
export async function loginRequest(payload: LoginPayload) {
  return { name: payload.email.split('@')[0], email: payload.email }
}
