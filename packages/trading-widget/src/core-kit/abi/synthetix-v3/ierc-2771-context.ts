export const IERC2771ContextAbi = [
  {
    type: 'function',
    name: 'isTrustedForwarder',
    inputs: [{ name: 'forwarder', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
] as const
