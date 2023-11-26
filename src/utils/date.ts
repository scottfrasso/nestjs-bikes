// I had to do this because I couldn't use jest.useFakeTimers()
// because it interferes with prisma
export const getCurrentDate = () => {
  return new Date()
}
