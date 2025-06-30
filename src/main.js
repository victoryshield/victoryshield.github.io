import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './style.css';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

/* import specific icons */
import { 
  faBook, 
  faDiceD6, 
  faAddressBook,
  faCalculator,
  faDiceOne,
  faCirclePlus,
  faCircleMinus,
  faStar,
  faSkullCrossbones,
  faCubes,
  faBullseye,
  faUserPen,
  faHandFist,
  faBrain,
  faShieldHalved,
  faHeartPulse,
  faWandMagicSparkles,
  faBolt,
  faBed,
  faListOl,
  faGraduationCap,
  faThumbsUp,
  faThumbsDown,
  faPersonRunning,
  faHatWizard,
  faUsers,
  faDragon,
  faScroll,
  faBookOpen,
  faStopwatch,
  faRotate,
  faRightLeft,
  faGavel,
  faKhanda,
  faHeartCrack,
  faHeart,
  faShieldHeart,
  faShoePrints,
  faRulerHorizontal,
  faCrosshairs,
  faSkull,
  faFaceDizzy,
  faHourglassHalf,
  faStarOfLife,
  faPersonFalling,
  faCircleQuestion,
  faUserSlash,
  faUserXmark,
  faHandcuffs,
  faPersonBurst,
  faBoltLightning,
  faPlusMinus,
  faHandRock,
  faScaleBalanced
} from '@fortawesome/free-solid-svg-icons';

/* add icons to the library */
library.add(
  faBook, 
  faDiceD6, 
  faAddressBook,
  faCalculator,
  faDiceOne,
  faCirclePlus,
  faCircleMinus,
  faStar,
  faSkullCrossbones,
  faCubes,
  faBullseye,
  faUserPen,
  faHandFist,
  faBrain,
  faShieldHalved,
  faHeartPulse,
  faWandMagicSparkles,
  faBolt,
  faBed,
  faListOl,
  faGraduationCap,
  faThumbsUp,
  faThumbsDown,
  faPersonRunning,
  faHatWizard,
  faUsers,
  faDragon,
  faScroll,
  faBookOpen,
  faStopwatch,
  faRotate,
  faRightLeft,
  faGavel,
  faKhanda,
  faHeartCrack,
  faHeart,
  faShieldHeart,
  faShoePrints,
  faRulerHorizontal,
  faCrosshairs,
  faSkull,
  faFaceDizzy,
  faHourglassHalf,
  faStarOfLife,
  faPersonFalling,
  faCircleQuestion,
  faUserSlash,
  faUserXmark,
  faHandcuffs,
  faPersonBurst,
  faBoltLightning,
  faPlusMinus,
  faHandRock,
  faScaleBalanced
);

const pinia = createPinia();

createApp(App)
  .use(router)
  .use(pinia)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');
