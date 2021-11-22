import io from 'socket.io-client';
import { useCallback } from 'react';

const backUrl = 'http://localhost:3095';
// const backUrl = process.env.NODE_ENV === 'production' ? '배포할 주소' : '백엔드 서버주소';

const sockets: { [ key:string ]: SocketIOClient.Socket } = {};
const useSocket = (workspace?: string): [ SocketIOClient.Socket | undefined, () => void ] => {
  console.log('Rerender', workspace);
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);

  if (!workspace) {
    return [undefined, disconnect];
  }
  if (!sockets[workspace]) {
    sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`, {
      transports: ['websocket'],
      // transports: ['websoket', 'polling'], http까지 사용하고 싶으면 poling 넣을 것.
    });

  }
  return [sockets[workspace], disconnect];
}

export default useSocket;