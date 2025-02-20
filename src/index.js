import './styles.css';
import UIController from './modules/uiController';

document.addEventListener('DOMContentLoaded', () => {
    UIController.renderprojects();
    UIController.setupEventListeners();
});
