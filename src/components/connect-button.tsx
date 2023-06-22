import imageFile from '../static/assets/alby.png';

interface ConnectButtonProps {
  onClick: () => void;
}

export function ConnectButton({ onClick }: ConnectButtonProps): JSX.Element {
  return (
    <button
      className="rounded-alby bg-gradient-to-b from-alby-400 from-65% to-alby-600 to-95% flex flex-row gap-2 items-center pl-4 pr-6 py-2"
      onClick={onClick}
    >
      <img src={imageFile} alt="Alby logo" width="21" height="21" />
      <p className="font-medium text-base text-black">Connect to Alby</p>
    </button>
  );
}
