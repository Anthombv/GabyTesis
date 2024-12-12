import styled from "styled-components";
import theme from "../../../lib/styles/theme";

const NavStyler = styled.div`
  .nav-link{
    color: ${theme.colors.grey};
    cursor: pointer;
  }
  .active{
    color: red !important;
  }
`
export default NavStyler