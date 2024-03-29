const classes = [
  { lat: 'a', hir: 'あ', kat: 'ア' },
  { lat: 'i', hir: 'い', kat: 'イ' },
  { lat: 'u', hir: 'う', kat: 'ウ' },
  { lat: 'e', hir: 'え', kat: 'エ' },
  { lat: 'o', hir: 'お', kat: 'オ' },
  { lat: 'ka', hir: 'か', kat: 'カ' },
  { lat: 'ki', hir: 'き', kat: 'キ' },
  { lat: 'ku', hir: 'く', kat: 'ク' },
  { lat: 'ke', hir: 'け', kat: 'ケ' },
  { lat: 'ko', hir: 'こ', kat: 'コ' },
  { lat: 'sa', hir: 'さ', kat: 'サ' },
  { lat: 'shi', hir: 'し', kat: 'シ' },
  { lat: 'su', hir: 'す', kat: 'ス' },
  { lat: 'se', hir: 'せ', kat: 'セ' },
  { lat: 'so', hir: 'そ', kat: 'ソ' },
  { lat: 'ta', hir: 'た', kat: 'タ' },
  { lat: 'chi', hir: 'ち', kat: 'チ' },
  { lat: 'tsu', hir: 'つ', kat: 'ツ' },
  { lat: 'te', hir: 'て', kat: 'テ' },
  { lat: 'to', hir: 'と', kat: 'ト' },
  { lat: 'na', hir: 'な', kat: 'ナ' },
  { lat: 'ni', hir: 'に', kat: 'ニ' },
  { lat: 'nu', hir: 'ぬ', kat: 'ヌ' },
  { lat: 'ne', hir: 'ね', kat: 'ネ' },
  { lat: 'no', hir: 'の', kat: 'ノ' },
  { lat: 'ha', hir: 'は', kat: 'ハ' },
  { lat: 'hi', hir: 'ひ', kat: 'ヒ' },
  { lat: 'fu', hir: 'ふ', kat: 'フ' },
  { lat: 'he', hir: 'へ', kat: 'ヘ' },
  { lat: 'ho', hir: 'ほ', kat: 'ホ' },
  { lat: 'ma', hir: 'ま', kat: 'マ' },
  { lat: 'mi', hir: 'み', kat: 'ミ' },
  { lat: 'mu', hir: 'む', kat: 'ム' },
  { lat: 'me', hir: 'め', kat: 'メ' },
  { lat: 'mo', hir: 'も', kat: 'モ' },
  { lat: 'ya', hir: 'や', kat: 'ヤ' },
  { lat: 'yu', hir: 'ゆ', kat: 'ユ' },
  { lat: 'yo', hir: 'よ', kat: 'ヨ' },
  { lat: 'ra', hir: 'ら', kat: 'ラ' },
  { lat: 'ri', hir: 'り', kat: 'リ' },
  { lat: 'ru', hir: 'る', kat: 'ル' },
  { lat: 're', hir: 'れ', kat: 'レ' },
  { lat: 'ro', hir: 'ろ', kat: 'ロ' },
  { lat: 'wa', hir: 'わ', kat: 'ワ' },
  { lat: 'wo', hir: 'を', kat: 'ヲ' },
  { lat: 'n', hir: 'ん', kat: 'ン' }
]
const props = {
  W: 48,
  H: 48,
  Size: 0,
  NumClasses: classes.length,
  classes,
  locations: {
    test: {
      labels: './data/bin/48x48/katakanaTestLabelsUint8',
      data: './data/bin/48x48/katakanaTestUint8',
    },
    training: {
      labels: './data/bin/48x48/katakanaLabelsUint8',
      data: './data/bin/48x48/katakanaUint8',
    },
  }
}

props.Size = props.W * props.H;

export const PROPS = {...props};
