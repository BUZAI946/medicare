import request from './index'
import type { Result, Payment } from '../types'

export function listPayments(patientId?: number, status?: number) {
  return request.get<any, Result<Payment[]>>('/payments', { params: { patientId, status } })
}

export function getPayment(id: number) {
  return request.get<any, Result<Payment>>(`/payments/${id}`)
}

export function createPayment(data: {
  patientId: number
  registrationId?: number
  prescriptionId?: number
  amount: number
  paymentMethod: string
  remark?: string
}) {
  return request.post<any, Result<Payment>>('/payments', data)
}

export function payPayment(id: number) {
  return request.put<any, Result<void>>(`/payments/${id}/pay`)
}

export function refundPayment(id: number) {
  return request.put<any, Result<void>>(`/payments/${id}/refund`)
}
