export const colors = {
  white: "#fff",
  black: '#000',
  yellow: "#f5bc00",
  gray: "#e1e1e1",
  lightGray: "#f7f9fa",
  lightBlack: "#47d276",
  darkBlack: "#47d276"
};

const bnbridgeTheme =  {
  typography: {
    fontFamily: ['Lato', 'Roboto', 'Open Sans', 'sans-serif'].join(","),
    lineHeight: 1.45,
    useNextVariants: true,
    h6: {
      fontFamily: ['Source Sans Pro','sans-serif'].join(","),
      fontSize: '1rem',
      color: colors.darkBlack,
      fontWeight: 600,
      marginBottom: '.5rem'
    }
  },
  type: 'light',
  overrides: {
    MuiInputBase: {
      root: {
        fontSize: '13px',
        background: colors.lightGray
      }
    },
    MuiGrid: {
    },
    MuiOutlinedInput: {
      input: {
        padding: '14px'
      }
    },
    MuiPrivateNotchedOutline: {
      root: {
        borderRadius: '0px'
      }
    },
    MuiButton: {
      label: {
        fontSize: '1rem'
      }
    },
    MuiTab: {
      label: {
        fontFamily: ['Source Sans Pro','sans-serif'].join(","),
        paddingTop: "1rem",
        paddingBottom: "1rem",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        fontWeight: 700,
      },
      root: {
        "&:hover": {
          backgroundColor: colors.darkBlack,
          color: "#FFF"
        },
        borderBottom: "1px solid #dee2e6!important"
      }

    },
  },
  palette: {
    primary: {
      main: colors.darkBlack
    },
    secondary: {
      main: colors.lightBlack
    },
    background:{
      paper: colors.white,
      default: colors.white
    },
    text: {
      primary: colors.lightBlack,
      secondary: colors.yellow
    }
  }
};

export default bnbridgeTheme;
