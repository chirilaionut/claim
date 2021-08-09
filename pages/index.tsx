import styled, { css } from 'styled-components';
import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { claimVestedTokens } from '../api/vesting';
import { unlockToken } from '../constants';
import { useBreakpoint } from '../hooks/breakpoints';
import {
  CHECK_KEPLR_REQUESTED,
  SHOW_HIDDEN_TOKEN_BALANCE_REQUESTED,
  KEPLR_SIGN_OUT,
} from '../redux/actions/user';
import { defaultColors } from '../styles/theme';
import notify from '../utils/notifications';
import NavBarLogo from '../components/NavBarLogo';
import ConnectWalletButton from '../components/ConnectWalletButton';
import ConnectWalletView from '../components/ConnectWalletView';
import ClaimButton from '../components/ClaimButton';
import PreLoadIndicator from '../components/PreLoadIndicator';
import { FaGithub } from 'react-icons/fa';
import { IStore } from '../redux/store';
import { getFeeForExecute } from '../api/utils';

interface Props {
  onClickConnectWallet: (e: React.SyntheticEvent) => void;
}

const Claim: React.FC<Props> = ({}) => {
  const [showConnectWalletView, setShowConnectWalletView] = useState(false);
  const [showSwapAccountDrawer, setShowSwapAccountDrawer] = useState(false);
  const [nextButtonLoading, setNextButtonLoading] = useState(false);
  const [afterClaim, setAfterClaim] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const user = useSelector((state: IStore) => state.user);
  const breakpoint = useBreakpoint();
  const dispatch = useDispatch();

  const isUnlock = user.balanceSIENNA === unlockToken;

  const renderBalanceSIENNA = () => {
    if (isUnlock) {
      return 'View Balance';
    }

    return `${user.balanceSIENNA} SIENNA` || '0 SIENNA';
  };

  useEffect(() => {
    dispatch({ type: CHECK_KEPLR_REQUESTED });
  }, [dispatch]);

  useEffect(() => {
    if (user.secretjs && user.isKeplrInstalled) {
      setShowConnectWalletView(false);
    }
  }, [user.secretjs, user.isKeplrInstalled]);

  useEffect(() => {
    if (user && user.isKeplrAuthorized && showConnectWalletView) {
      setShowConnectWalletView(false);
      setShowSwapAccountDrawer(false);
    }
  }, [user, showConnectWalletView]);

  const onClickUnlockToken = (e: React.SyntheticEvent) => {
    e.stopPropagation();

    dispatch({
      type: SHOW_HIDDEN_TOKEN_BALANCE_REQUESTED,
      payload: {
        tokenAddress: process.env.SIENNA_CONTRACT,
        symbol: undefined,
      },
    });
  };

  // user clicks on connect/disconnect wallet button
  const onClickToggleWallet = () => {
    if (user && user.isKeplrAuthorized) {
      dispatch({ type: KEPLR_SIGN_OUT });
    } else {
      setShowConnectWalletView(true);
      dispatch({ type: CHECK_KEPLR_REQUESTED });
      setShowSwapAccountDrawer(true);
    }
  };

  const onClickClaimNow = async () => {
    setNextButtonLoading(true);

    try {
      await claimVestedTokens(
        user.secretjsSend,
        process.env.MGMT_CONTRACT,
        getFeeForExecute(600_000)
      );

      dispatch({ type: CHECK_KEPLR_REQUESTED });
      dispatch({
        type: SHOW_HIDDEN_TOKEN_BALANCE_REQUESTED,
        payload: {
          tokenAddress: process.env.SIENNA_CONTRACT,
          symbol: undefined,
        },
      });
      setNextButtonLoading(false);
      setAfterClaim(true);

      notify.success(`Successfully claimed SIENNA tokens`, 4.5);
    } catch (error) {
      console.log('Error claiming', error);
      notify.error(`Error claiming SIENNA tokens`, 4.5);
      setNextButtonLoading(false);
    }
  };

  const onClickCloseClaimNow = () => {
    setNextButtonLoading(false);
    setAfterClaim(false);
  };

  const connectKeplr = async () => {
    if (!user.isKeplrInstalled) {
      setErrorMessage('You need to install Keplr Wallet');

      const a = document.createElement('a');
      a.href = 'https://wallet.keplr.app/';
      a.target = '_blank';
      a.rel = 'noopener norefferer';
      a.click();
      return;
    }

    dispatch({ type: CHECK_KEPLR_REQUESTED });
  };

  return (
    <ClaimContainer>
      <ClaimTopNavBar>
        <ClaimTopNavBarLeft xs="12" sm="12" md="12" lg="6" xl="6">
          <NavBarLogo />
        </ClaimTopNavBarLeft>

        <ClaimTopNavBarRight xs="12" sm="12" md="12" lg="6" xl="6">
          <span>Balance:</span>
          <UnlockTokenButton onClick={onClickUnlockToken} isUnlock={isUnlock}>
            {renderBalanceSIENNA()}
          </UnlockTokenButton>
          {!user.isKeplrAuthorized && <ConnectWalletButton onClick={onClickToggleWallet} />}
          <ConnectWalletView
            visible={showSwapAccountDrawer}
            onClose={() => setShowSwapAccountDrawer(false)}
          />
        </ClaimTopNavBarRight>
      </ClaimTopNavBar>

      <ClaimBody>
        <ClaimBodyLeft xs="12" sm="12" md="12" lg="6" xl="6">
          <h1>Claim your SIENNA</h1>
          {user.isKeplrAuthorized ? (
            <ClaimButton
              text="Disconnect Wallet"
              icon="/icons/wallet-light.svg"
              fontSize="12px"
              width="16.64"
              height="16"
              onClick={onClickToggleWallet}
              disabled={false}
              containerStyle={{
                backgroundColor: defaultColors.blackStone80,
              }}
            />
          ) : (
            <ClaimButton
              text="Connect Keplr Wallet"
              icon="/icons/wallet-light.svg"
              fontSize="12px"
              width="16.64"
              height="16"
              onClick={connectKeplr}
              disabled={false}
              containerStyle={{
                backgroundColor: defaultColors.swapBlue,
              }}
            />
          )}
          <ErrorText>{errorMessage}</ErrorText>
        </ClaimBodyLeft>

        <ClaimBodyRight xs="12" sm="12" md="12" lg="6" xl="6">
          <p>
            If you participated in the private sale for Sienna, you can claim your SIENNA tokens
            here.
          </p>
          {user.isKeplrAuthorized && <p>New tokens will arrive every 24 hours.</p>}
        </ClaimBodyRight>
      </ClaimBody>

      <ClaimFooter>
        <Icon href={'https://github.com/SiennaNetwork/claim'} target="_blank">
          <FaGithub size={24} />
        </Icon>
        <ClaimButton
          text={
            nextButtonLoading ? (
              <PreLoadIndicator
                darkMode
                height={36}
                containerStyle={{ height: 36, textAlign: 'center', margin: '0 auto' }}
              />
            ) : (
              'Claim Now'
            )
          }
          icon={nextButtonLoading ? false : '/icons/arrow-forward-light.svg'}
          fontSize="14px"
          width="12"
          height="9"
          containerStyle={{
            width: breakpoint.xs || breakpoint.sm ? '100%' : '50%',
            justifyContent: 'center',
          }}
          onClick={onClickClaimNow}
          disabled={nextButtonLoading}
        />
      </ClaimFooter>

      {afterClaim && (
        <ClaimSuccessful>
          <ClaimCloseButton>
            <Img onClick={onClickCloseClaimNow} src="/icons/close-x.svg" alt="close" />
          </ClaimCloseButton>

          <div>
            <h4>Success!</h4>
            <p>You have just claimed the available SIENNA for claim, if any.</p>
          </div>
        </ClaimSuccessful>
      )}
    </ClaimContainer>
  );
};

export default Claim;

const Icon = styled.a`
  position: fixed;
  bottom: 10px;
  left: 40px;
  text-decoration: none;
  color: inherit;
  &:hover {
    color: inherit;
    opacity: 0.7;
  }
`;

const Img = styled.img``;

const ClaimContainer = styled.div`
  padding: 0;
  margin: 0;
  background: #fff;
`;

const ClaimTopNavBar = styled(Row)`
  margin: 0;
  height: 10vh;

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    height: auto;
    padding-bottom: 30px;
  }
`;

const ClaimTopNavBarLeft = styled(Col)`
  padding-left: 0;
  background: ${defaultColors.white};
`;

const ClaimTopNavBarRight = styled(Col)`
  justify-content: flex-end;
  display: flex;
  padding: 40px 40px 0 0;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 40px 15px 0 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
`;

const ClaimBody = styled(Row)`
  margin: 0;
  height: calc(90vh - 48px);
  align-content: center;

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    height: auto;
  }
`;

const ClaimBodyLeft = styled(Col)<{ $darkMode?: boolean }>`
  padding: 0;
  height: 100%;
  background: ${defaultColors.white};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 157px;

  > h1 {
    font-size: 50px;
    font-weight: 800;
    line-height: 61px;
    color: ${(props) => (props.$darkMode ? '#fff' : '#000')};
    width: 277px;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    padding-top: 30px;
    padding-bottom: 30px;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    padding-right: 0;
    padding-left: 57px;

    > h1 {
      font-size: 40px;
      line-height: 50px;
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding-right: 0;
    padding-left: 20px;

    > h1 {
      font-size: 35px;
      line-height: 45px;
    }
  }
`;

const ClaimBodyRight = styled(Col)`
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  padding-right: 200px;

  > p {
    font-size: 21px;
    font-weight: 600;
    line-height: 25px;
    width: 319px;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.xl}) {
    padding-right: 147px;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    padding-right: 0;
    padding-left: 157px;
    align-items: flex-start;

    padding-top: 30px;
    padding-bottom: 30px;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    padding-right: 0;
    padding-left: 57px;

    > p {
      font-size: 18px;
      line-height: 24px;
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding-right: 0;
    padding-left: 20px;

    > p {
      font-size: 18px;
      line-height: 24px;
    }
  }
`;

const ClaimFooter = styled(Row)`
  margin: 0;
  justify-content: flex-end;
  padding: 0;
  background: ${defaultColors.white};
`;

const UnlockButtonCSS = css`
  pointer-events: initial;
  border: 1px solid black;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 20px;
  background: ${(props) => props.theme.colors.text};
  color: ${(props) => props.theme.colors.textInverted};
  font-size: 11px;
  padding-top: 1px;
  padding-bottom: 1px;

  &:hover {
    opacity: 0.7;
  }
`;

const UnlockTokenButton = styled.div<{ isUnlock?: boolean }>`
  color: ${(props) => props.theme.colors.text};
  height: 21px;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 14px;
  margin-left: 5px;
  pointer-events: none;
  display: inline-block;
  cursor: pointer;

  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;

  ${(props) => (props.isUnlock ? UnlockButtonCSS : null)};
`;

const ClaimSuccessful = styled.div`
  width: 216px;
  height: 298px;
  position: absolute;
  bottom: 0px;
  right: 0;
  background: ${defaultColors.dark};
  margin: 0;
  padding: 12px 10px 0 10px;

  > div {
    padding: 0 14px;
  }

  > div > h4 {
    color: #fff;
    font-size: 16px;
    font-weight: bold;
  }

  > div > p {
    font-size: 12px;
    color: #fff;
    margin-bottom: 18px;
  }

  > div > button {
    background: ${defaultColors.white};
    color: ${defaultColors.blackStone80};
    border-radius: 50px;
    width: 137px;
    height: 24px;
    font-size: 12px;
    border: none;
    outline: none;
    margin-bottom: 10px;

    > div > button > img {
      margin-left: 5px;
      margin-bottom: 2px;
    }

    > div > img {
      width: 6px;
      height: 6px;
      margin-left: 5px;
      margin-bottom: 2px;
    }
  }

  > div > span {
    font-size: 12px;
    color: #fff;
    margin-top: 5px;
    display: inline-block;
    width: 135px;
  }
`;

const ClaimCloseButton = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 0 !important;

  > img {
    cursor: pointer;
    width: 20px;
  }
`;

const ErrorText = styled.div`
  color: ${(props) => props.theme.colors.warning};
  text-align: center;
`;
