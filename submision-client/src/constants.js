const EDIT_MODES = {
    OBSERVE: 'OBSERVE',
    PAN: 'PAN'
}

const RANDOM_COLORS = [];

for(let i =0 ;i<20;i++) {
    RANDOM_COLORS.push(`hsl(${parseInt(Math.random() * 360)},100%,55%)`);
}

export {EDIT_MODES, RANDOM_COLORS};