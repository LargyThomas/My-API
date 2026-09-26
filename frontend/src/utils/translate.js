// Simple French translations for the raw English values coming from the database
const ANIMAL_TYPES = {
	Dog: 'Chien',
	Cat: 'Chat',
	Bird: 'Oiseau',
	Livestock: 'Bétail',
	Other: 'Autre'
}

const SEXES = {
	Male: 'Mâle',
	Female: 'Femelle',
	Unknown: 'Inconnu'
}

const ORIGINS = {
	Stray: 'Errant',
	'Owner Surrender': 'Cédé par son propriétaire',
	'Public Assist': 'Assistance publique',
	'Euthanasia Request': "Demande d'euthanasie",
	Wildlife: 'Faune sauvage',
	Abandoned: 'Abandonné'
}

const CONDITIONS = {
	Normal: 'Normal',
	Injured: 'Blessé',
	Nursing: "En cours d'allaitement",
	Sick: 'Malade',
	Other: 'Autre',
	Pregnant: 'Enceinte',
	Aged: 'Âgé',
	Feral: 'Sauvage',
	'Med Attn': 'Attention médicale requise',
	Neonatal: 'Nouveau-né',
	Medical: 'Cas médical',
	Behavior: 'Problème de comportement',
	Unknown: 'Inconnu',
	Space: 'Manque de place au refuge',
	Panleuk: 'Panleucopénie',
	'Med Urgent': 'Urgence médicale',
	Agonal: 'État critique',
	Neurologic: 'Problème neurologique',
	Parvo: 'Parvovirose',
	Congenital: 'Malformation congénitale'
}

const COLORS = {
	White: 'Blanc',
	Black: 'Noir',
	Brown: 'Marron',
	Tan: 'Fauve',
	Tricolor: 'Tricolore',
	Orange: 'Roux',
	Cream: 'Crème',
	Gray: 'Gris',
	Grey: 'Gris',
	Blue: 'Bleu',
	Red: 'Rouge',
	Yellow: 'Jaune',
	Chocolate: 'Chocolat',
	Fawn: 'Fauve',
	Brindle: 'Bringé',
	Sable: 'Sable',
	Buff: 'Beige',
	Gold: 'Doré',
	Silver: 'Argenté',
	Pink: 'Rose',
	Calico: 'Écaille de tortue',
	Torbie: 'Écaille de tortue tigrée'
}

// Generic helper: looks up "value" inside "dictionary".
// If it's not found (typo, new value, etc.), we just show the original value
// instead of showing "undefined" to the user.
function translate(dictionary, value) {
	return dictionary[value] || value
}

export function translateAnimalType(value) {
	return translate(ANIMAL_TYPES, value)
}

export function translateSex(value) {
	return translate(SEXES, value)
}

export function translateOrigin(value) {
	return translate(ORIGINS, value)
}

export function translateCondition(value) {
	return translate(CONDITIONS, value)
}

// Colors can be a combo like "White/Tan" or "Brown Tabby/White".
// We split on "/", translate each piece separately, then join them back.
export function translateColor(value) {
	if (!value) return value

	return value
		.split('/')
		.map((part) => translate(COLORS, part.trim()))
		.join(' / ')
}