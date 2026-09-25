export function getAnimalImageUrl(animal = {}) {
  const existingImage = typeof animal?.image === 'string' ? animal.image.trim() : ''

  if (existingImage) {
    return existingImage
  }

  const type = String(animal?.animal_type || animal?.type || 'animal').toLowerCase()

  const fallbackImages = {
    dog: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80',
    cat: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=900&q=80',
    bird: 'https://images.unsplash.com/photo-1444464666166-8c4f4bb9f4a2?auto=format&fit=crop&w=900&q=80',
    horse: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=900&q=80'
  }

  return fallbackImages[type] || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80'
}
