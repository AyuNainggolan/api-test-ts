// Defining the interface
export interface SharedState {
  headers: Record<string, string>
  response: any
  requestData: Record<string, any>
}

// Creating a constant that implements the interface SharedState
export const sharedState: SharedState = {
  headers: {},
  response: {},
  requestData: {},
}
