import constitutionalLaw from './constitutionalLaw';
import contracts from './contracts';
import torts from './torts';
import criminalLaw from './criminalLaw';
import evidence from './evidence';
import civilProcedure from './civilProcedure';
import constitutionalLawII from './constitutionalLawII';
import legalTerminology from './legalTerminology';
import willsTrustsEstates from './willsTrustsEstates';
import corporateBusinessLaw from './corporateBusinessLaw';
import propertyLaw from './propertyLaw';
import familyLaw from './familyLaw';
import intellectualProperty from './intellectualProperty';
import taxLaw from './taxLaw';

// order here drives the default "Your decks" sort
export const DECKS = [
  constitutionalLaw,
  contracts,
  torts,
  criminalLaw,
  evidence,
  civilProcedure,
  constitutionalLawII,
  legalTerminology,
  willsTrustsEstates,
  corporateBusinessLaw,
  propertyLaw,
  familyLaw,
  intellectualProperty,
  taxLaw,
];

// flat list of every card, tagged with its deck id, for progress lookups
// and study-session queues that span multiple decks
export const ALL_CARDS = DECKS.flatMap(deck =>
  deck.cards.map(card => ({ ...card, deckId: deck.id }))
);

export const getDeck = (deckId) => DECKS.find(d => d.id === deckId);
