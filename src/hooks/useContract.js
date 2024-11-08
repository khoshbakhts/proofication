import { useWeb3 } from '../contexts/Web3Context';

export default function useContract() {
 const { provider } = useWeb3();
 return {};
}