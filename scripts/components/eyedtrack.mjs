import { esc } from '../lib/svg.mjs';
import { EAR_TRACE } from './paths.mjs';
import { gridPattern, project, sheetHead, sheetMetrics, sheetTitleBlock } from './sheet.mjs';

const EYE = 'M622 116Q700 72 778 116Q700 160 622 116Z';
// The six eye-aspect-ratio landmarks: corners, then upper and lower lid points.
const LANDMARKS = [[622, 116], [672, 97], [728, 97], [778, 116], [728, 135], [672, 135]];

export default {
  name: 'eyedtrack',
  width: 1200,
  height: 300,
  render(content) {
    const eyed = project(content, 'eyedtrack');
    const { traceLabel, alert } = eyed.figure;
    return [
      `<defs><clipPath id="eyeClip"><path d="${EYE}"/></clipPath><clipPath id="eClip"><rect x="40" y="176" width="750" height="40"/></clipPath>${gridPattern('gS3')}</defs>`,
      sheetHead(eyed, 'gS3'),
      // The trace scrolls 750 units every 6 s; its blinks and drowsy dip reach the right edge in step
      // with the eye below (spec section 6).
      `<g clip-path="url(#eClip)"><path class="wave" d="${EAR_TRACE}"/></g>`,
      '<path class="thr" d="M40 204H790"/>',
      `<text class="earlabel" x="790" y="182" text-anchor="end">${esc(traceLabel)}</text>`,
      `<g class="alertchip"><rect x="696" y="166" width="94" height="22" rx="4"/><text class="alertt" x="743" y="182" text-anchor="middle">${esc(alert)}</text></g>`,
      sheetMetrics(eyed.metrics, [40, 300, 560]),
      sheetTitleBlock(eyed.titleBlock),
      '<g class="eye">',
      '<g clip-path="url(#eyeClip)"><circle class="iris" cx="700" cy="116" r="17"/><circle class="pupil" cx="700" cy="116" r="6.5"/></g>',
      `<path class="eyeout" d="${EYE}"/>`,
      '<path class="eard" d="M672 97V135M728 97V135M622 116H778"/>',
      LANDMARKS.map(([cx, cy]) => `<circle class="lm" cx="${cx}" cy="${cy}" r="4"/>`).join(''),
      '</g>',
    ].join('\n');
  },
};
