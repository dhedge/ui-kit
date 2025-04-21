import { useCallback } from 'react'
import { useLimitOrderState } from './state'

export interface ValidationError {
  field: string
  message: string
}

export const useLimitOrderValidation = () => {
  const { form, pricingAsset } = useLimitOrderState()

  const validateForm = useCallback((): ValidationError[] => {
    const errors: ValidationError[] = []

    // Validate take profit price
    if (!form.takeProfitPrice) {
      errors.push({
        field: 'takeProfitPrice',
        message: 'Take profit price is required',
      })
    } else {
      const price = parseFloat(form.takeProfitPrice)
      if (isNaN(price) || price <= 0) {
        errors.push({
          field: 'takeProfitPrice',
          message: 'Take profit price must be greater than 0',
        })
      }
    }

    // Validate stop loss price
    if (!form.stopLossPrice) {
      errors.push({
        field: 'stopLossPrice',
        message: 'Stop loss price is required',
      })
    } else {
      const price = parseFloat(form.stopLossPrice)
      if (isNaN(price) || price <= 0) {
        errors.push({
          field: 'stopLossPrice',
          message: 'Stop loss price must be greater than 0',
        })
      }
    }

    // Validate terms acceptance
    if (!form.termsAccepted) {
      errors.push({
        field: 'termsAccepted',
        message: 'You must accept the terms and conditions',
      })
    }

    // Validate price relationship
    if (form.takeProfitPrice && form.stopLossPrice) {
      const takeProfit = parseFloat(form.takeProfitPrice)
      const stopLoss = parseFloat(form.stopLossPrice)
      
      if (!isNaN(takeProfit) && !isNaN(stopLoss)) {
        if (takeProfit <= stopLoss) {
          errors.push({
            field: 'priceRelationship',
            message: 'Take profit price must be greater than stop loss price',
          })
        }
      }
    }

    return errors
  }, [form, pricingAsset])

  const isValid = useCallback((): boolean => {
    return validateForm().length === 0
  }, [validateForm])

  return {
    validateForm,
    isValid,
  }
} 