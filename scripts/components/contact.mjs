import { esc, r1 } from '../lib/svg.mjs';
import { GITHUB_MARK, LINKEDIN_MARK } from './paths.mjs';

// Icons are centered on each card's bubble; y is the bubble's center.
const ICONS = {
  email: (y) => `<path class="icol" d="M623 ${y - 8}h22v16h-22zM623 ${y - 8}l11 9 11-9"/>`,
  linkedin: (y) => `<path class="ico" transform="translate(623.2 ${r1(y - 10.8)}) scale(.9)" d="${LINKEDIN_MARK}"/>`,
  github: (y) => `<path class="ico" transform="translate(623.2 ${r1(y - 10.8)}) scale(1.35)" d="${GITHUB_MARK}"/>`,
};

export default {
  name: 'contact',
  width: 1200,
  height: 280,
  render(content) {
    const { heading, cards } = content.contact;
    const cardMarkup = cards.map((card, i) => {
      const y = 72 + 68 * i;
      return [
        `<rect class="card" x="600" y="${y - 28}" width="544" height="56" rx="6"/>`,
        `<circle class="bubble" cx="634" cy="${y}" r="20"/>`,
        ICONS[card.kind](y),
        `<circle class="cping cp${i}" cx="634" cy="${y}" r="20"/>`,
        `<text class="tl2" x="668" y="${y - 6}">${esc(card.label)}</text><text class="tv2" x="668" y="${y + 18}">${esc(card.value)}</text>`,
      ].join('\n');
    });
    return [
      '<rect class="sheet" width="1200" height="280"/>',
      '<rect class="frame1" x="10" y="10" width="1180" height="260"/>',
      '<rect class="frame" x="24" y="24" width="1152" height="232"/>',
      `<text class="hwc" x="64" y="166">${esc(heading)}</text>`,
      '<path class="cx" d="M462 140H530V72H600M462 140H600M530 140V208H600"/>',
      '<circle class="hub" cx="462" cy="140" r="6"/>',
      ...cardMarkup,
      '<g class="cpk"><circle class="pkt c0" cx="462" cy="140" r="5"/><circle class="pkt c1" cx="462" cy="140" r="5"/><circle class="pkt c2" cx="462" cy="140" r="5"/></g>',
    ].join('\n');
  },
};
