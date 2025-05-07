import createElement from '../helpers/domHelper';

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    // todo: show fighter info (image, name, health, etc.)

    if (fighter) {
        const imageElement = createFighterImage(fighter);

        const infoElement = createElement({
            tagName: 'div',
            className: 'fighter-preview___info'
        });

        const name = createElement({ tagName: 'h3', className: 'fighter-preview___name' });
        name.innerText = fighter.name;

        const statsContainer = createElement({ tagName: 'div', className: 'fighter-preview___stats' });

        const stats = ['health', 'attack', 'defense'].map(stat => {
            const statElement = createElement({
                tagName: 'p',
                className: `fighter-preview___${stat}`
            });
            statElement.innerText = `${stat[0].toUpperCase() + stat.slice(1)}: ${fighter[stat]}`;
            return statElement;
        });

        statsContainer.append(...stats);
        infoElement.append(name, statsContainer);
        fighterElement.append(imageElement, infoElement);
    }

    return fighterElement;
}
