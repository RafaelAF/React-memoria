import { useEffect, useState } from 'react';
import * as C from './App.styled';
import logoImage from './assets/devmemory_logo.png';
import { Button } from './Components/Button';
import { InfoItem } from './Components/InfoItem';
import RestarIcon from './svgs/restart.svg'
import {GridItemType} from './types/GridItemType';
import { items } from './data/items';
import { GridItem } from './Components/GridItem';
import { formatTimerElapsed } from './helpers/formatTimeElapsed';

const App = () =>{
  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [showncount, setShownCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([])

  useEffect(()=> resetAndCreateGrid(), [])

  useEffect(()=>{
    const timer = setInterval(()=>{
      if(playing){
        setTimeElapsed(timeElapsed + 1)
      }
    }, 1000);
    return () => clearInterval(timer)
  },[playing, timeElapsed]);

  useEffect(()=>{
    if(showncount === 2){
      let opened = gridItems.filter(item => item.shown === true);
      if(opened.length === 2){
        
        if(opened[0].item === opened[1].item){
          // se os dois forem iguais, deixa-los permanentes
          setTimeout(() => {
            let tmpGrid = [...gridItems]
            for(let i in tmpGrid){
              if(tmpGrid[i].shown){
                if(tmpGrid[i].shown){
                  tmpGrid[i].permanentShown = true;
                  tmpGrid[i].shown = false;
                  
                }
              }
            }
            setGridItems(tmpGrid);
            setShownCount(0)
            setMoveCount(moveCount => moveCount + 1)
          }, 1000);
          
        }else{
          setTimeout(() => {
            let tmpGrid = [...gridItems]
            for(let i in tmpGrid){
              tmpGrid[i].shown = false;
            }
            setGridItems(tmpGrid);
            setShownCount(0)
            setMoveCount(moveCount => moveCount + 1)
          }, 1000);
        }
      }
    }
  },[showncount, gridItems])


  // verify if game is over
  useEffect(()=>{
      if(moveCount > 0 && gridItems.every(item => item.permanentShown === true)){
        setPlaying(false)
      }
  },[moveCount, gridItems])


  const resetAndCreateGrid = () =>{
    // passo 1 - zerar as variaveis
    setTimeElapsed(0)
    setMoveCount(0)
    setShownCount(0)
    // passo 2 - criar o grid e começar o jogo
    // passo 2.1 - criar um grid vazio
    let tmpGrid: GridItemType[] = [];
    for(let i = 0;i< (items.length * 2) ; i++){
      tmpGrid.push({
        item: null,
        shown: false,
        permanentShown: false,
      })
    }
    // passo 2.2 - preencher o grid
    for(let w = 0; w < 2; w++){
      for(let i = 0; i < (items.length); i++){
        let pos = -1;
        while(pos < 0 || tmpGrid[pos].item !== null) {
          pos = Math.floor(Math.random() * (items.length * 2));
          
        }
        tmpGrid[pos].item = i;
      }
    }

    // passo 2.3 - jogar no state
    setGridItems(tmpGrid)

    setPlaying(true)
  }
  const handleItemClick = (index:number) =>{
    if(playing && index !== null && showncount < 2){
      let tmpGrid = [...gridItems];
      if(tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false){
        tmpGrid[index].shown = true;
        setShownCount(showncount + 1)
      }
      setGridItems(tmpGrid)
    }
  }

  return (
    <C.Container>
      <C.Info>
        <C.LogoLink href="">
          <img src={logoImage} width="200" alt="" />
        </C.LogoLink>
        <C.infoArea>

          <InfoItem label='Tempo' value={formatTimerElapsed(timeElapsed)}  />
          <InfoItem label='Movimentos' value={moveCount.toString()} />
        </C.infoArea>
        <Button label='Reiniciar' icon={RestarIcon} onClick={resetAndCreateGrid} />
      </C.Info>
      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index)=>(
            <GridItem
              key={index}
              item={item}
              onClick={()=> handleItemClick(index)}
            />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  );
}

export default App