import styled from 'styled-components';

export const PopUpContainer = styled.div`
  display: ${props => props.show ? 'block' : 'none'};
  position: absolute;
  left: ${props=> props.left ? props.left : '450px'};
  top: ${props=> props.top ? props.top : '250px'};
  width: ${props=> props.width ? props.width : '300px'};
  height: ${props=> props.height ? props.height : '200px'};
  padding: 20px;
  background-color: rgb(200, 200, 200, 0.5);
  z-index: 200;
  font-size: 12px;
  border-radius: 5px;
`;

export const PopUpControl = styled.div`
  position: absolute;
  bottom 20px;
  width: 90%;
  display: flex;
  justify-content: space-evenly;
`;

export const OutputResultTable = styled.table`
  width: 100%;
  height: 75%;
  padding: 10px;

  & td {
    border: 0.5px solid black;
  }
`;
