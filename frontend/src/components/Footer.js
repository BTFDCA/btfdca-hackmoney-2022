import { ADDRESSES } from "../config/constants";

function Footer({ chainId }) {
  return (
    <footer className="bg-light base-px bg-bnft-gray text-[0.5rem] md:text-xs leading-6 pt-8">
      <div className="footer-content">
        <span>Copyright © Since 2022 by BTFDCA</span>
        <span className="separator">·</span>
        {/* contract's superfluid dashboard */}
        {/* TODO: get network name from somewhere */}
        <a
          href={
            "https://console.superfluid.finance/" +
            "mumbai" +
            "/accounts/" +
            ADDRESSES[chainId].ADDRESS_DCA_SUPERAPP
          }
          target="_blank"
          rel="noreferrer"
        >
          BTFDCA Superfluid Console
        </a>
        <span className="separator">·</span>
        <a href="https://banner-nfts.com">
          Yo, help a brother out. Go mint my NFT!
        </a>
      </div>
    </footer>
  );
}

export default Footer;
