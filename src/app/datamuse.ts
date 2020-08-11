export class dataMuseQuery {
	sp: string; //word
	qe = 'sp'
	md = 'frd'
	max = '1'

}

export class wordObject {
	word: string;
	id: number;
	defs: string[]; // a : seprated string
	wordNetDef: string[]
	pos: string; // part of speech
	nGramFreq: number;
	examples: string[];
	shortExample: string[];
	podcastLink: string;
	synonyms: string[];
	imageUrls: string[]
}