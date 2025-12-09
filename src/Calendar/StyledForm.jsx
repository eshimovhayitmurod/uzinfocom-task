import styled from 'styled-components';
export const StyledForm = styled.div`
    & .popover-title {
        font-size: 20px;
        font-weight: 600;
        margin: 0;
        color: black;
        text-align: left;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        & button {
            height: 36px;
            width: 36px;
            border-radius: 50%;
            background-color: red;
            border: none;
            outline: none;
            color: white;
            cursor: pointer;
        }
    }
    & form {
        padding: 10px 0 0 0;
        display: flex;
        flex-direction: column;
        gap: 16px;
        & > div {
            width: 100%;
            & label {
                color: #717171;
                font-size: 15px;
                font-medium: 700;
                margin: 0 0 4px 0;
                text-align: left;
                width: 100%;
            }
            & input {
                background-color: #ffffff;
                border-radius: 10px;
                border: 2px solid #e1e1e1;
                font-size: 18px;
                font-weight: 500;
                height: 44px;
                outline: none;
                padding-left: 17px;
                width: calc(100% - 21px);
                &[data-error='true'] {
                    border: 2px solid #ff5749;
                }
                &:focus {
                    border: 2px solid #0051ffff;
                }
                &:disabled {
                    background-color: #f4f4f4;
                    border: 2px solid #e1e1e1;
                    color: #717171;
                }
            }
            & textarea {
                background-color: #ffffff;
                border-radius: 10px;
                border: 2px solid #e1e1e1;
                font-size: 18px;
                font-weight: 500;
                min-height: 60px;
                outline: none;
                padding: 10px 10px 10px 17px;
                width: calc(100% - 31px);
                &[data-error='true'] {
                    border: 2px solid #ff5749;
                }
                &:focus {
                    border: 2px solid #0051ffff;
                }
                &:disabled {
                    background-color: #f4f4f4;
                    border: 2px solid #e1e1e1;
                    color: #717171;
                }
            }
                & button {
                    background: #0051ffff;
                    color: white;
                    font-size: 18px;
                    font-weight: 500;
                    height: 44px;
                    width: 100%;
                    padding: 0;
                    border: none;
                    border-radius: 10px;
                }
        }
    }
`