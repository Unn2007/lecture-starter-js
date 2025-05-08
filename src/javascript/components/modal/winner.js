import createElement from '../../helpers/domHelper';
import showModal from './modal';
import { createFighterImage } from '../fighterPreview';

export default function showWinnerModal(fighter) {
    const bodyElement = createElement({ tagName: 'div', className: 'modal-body' });
    const image = createFighterImage(fighter);
    const name = createElement({ tagName: 'h2' });
    name.innerText = `${fighter.name} is the winner!`;

    bodyElement.append(name, image);

    showModal({
        title: 'Winner!',
        bodyElement,
        onClose: () => window.location.reload()
    });
}
