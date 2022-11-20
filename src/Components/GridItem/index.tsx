import { GridItemType } from '../../types/GridItemType';
import * as C from './styles';

import B7 from '../../svgs/b7.svg';
import { items } from '../../data/items';

type Props = {
    item: GridItemType;
    onClick: () => void
}

export const GridItem = ({item, onClick }: Props) => {
    return (
        <C.Container 
            showBackground={item.permanentShown || item.shown}
            onClick={onClick}>
            {item.permanentShown === false && item.shown === false &&
                <C.B7Icon src={B7} alt="" opacity={.5}/>
            }
            {(item.permanentShown || item.shown) && item.item !== null &&
                <C.B7Icon src={items[item.item].icon} alt='' />
            }
        </C.Container>
    );
}