'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">vmp-frontend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="dependencies.html" data-type="chapter-link">
                                <span class="icon ion-ios-list"></span>Dependencies
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse" ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-9b2dac059fdc28341edb11b3540ad69a"' : 'data-target="#xs-components-links-module-AppModule-9b2dac059fdc28341edb11b3540ad69a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-9b2dac059fdc28341edb11b3540ad69a"' :
                                            'id="xs-components-links-module-AppModule-9b2dac059fdc28341edb11b3540ad69a"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MaterializeAutocompleteComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MaterializeAutocompleteComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PatientCardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PatientCardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PatientDocumentModalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PatientDocumentModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PatientHistoryModalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PatientHistoryModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PatientUnionModalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PatientUnionModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Stage0Component.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">Stage0Component</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Stage1Component.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">Stage1Component</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Stage2Component.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">Stage2Component</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Stage3Component.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">Stage3Component</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Stage4Component.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">Stage4Component</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Stage5Component.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">Stage5Component</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Stage6Component.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">Stage6Component</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TalonComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TalonComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-AppModule-9b2dac059fdc28341edb11b3540ad69a"' : 'data-target="#xs-pipes-links-module-AppModule-9b2dac059fdc28341edb11b3540ad69a"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-AppModule-9b2dac059fdc28341edb11b3540ad69a"' :
                                            'id="xs-pipes-links-module-AppModule-9b2dac059fdc28341edb11b3540ad69a"' }>
                                            <li class="link">
                                                <a href="pipes/SnilsPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SnilsPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Access.html" data-type="entity-link">Access</a>
                            </li>
                            <li class="link">
                                <a href="classes/Country.html" data-type="entity-link">Country</a>
                            </li>
                            <li class="link">
                                <a href="classes/Decision.html" data-type="entity-link">Decision</a>
                            </li>
                            <li class="link">
                                <a href="classes/DiseaseCode.html" data-type="entity-link">DiseaseCode</a>
                            </li>
                            <li class="link">
                                <a href="classes/DiseaseModel.html" data-type="entity-link">DiseaseModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/FiasAddress.html" data-type="entity-link">FiasAddress</a>
                            </li>
                            <li class="link">
                                <a href="classes/FinancingSource.html" data-type="entity-link">FinancingSource</a>
                            </li>
                            <li class="link">
                                <a href="classes/InsuranceCompany.html" data-type="entity-link">InsuranceCompany</a>
                            </li>
                            <li class="link">
                                <a href="classes/Lgota.html" data-type="entity-link">Lgota</a>
                            </li>
                            <li class="link">
                                <a href="classes/MedicalInstitution.html" data-type="entity-link">MedicalInstitution</a>
                            </li>
                            <li class="link">
                                <a href="classes/MedicalProfile.html" data-type="entity-link">MedicalProfile</a>
                            </li>
                            <li class="link">
                                <a href="classes/MedicalProfileDetail.html" data-type="entity-link">MedicalProfileDetail</a>
                            </li>
                            <li class="link">
                                <a href="classes/MedicalSubProfile.html" data-type="entity-link">MedicalSubProfile</a>
                            </li>
                            <li class="link">
                                <a href="classes/Organ.html" data-type="entity-link">Organ</a>
                            </li>
                            <li class="link">
                                <a href="classes/Patient.html" data-type="entity-link">Patient</a>
                            </li>
                            <li class="link">
                                <a href="classes/PatientDocument.html" data-type="entity-link">PatientDocument</a>
                            </li>
                            <li class="link">
                                <a href="classes/PatientHistory.html" data-type="entity-link">PatientHistory</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResponsiblePerson.html" data-type="entity-link">ResponsiblePerson</a>
                            </li>
                            <li class="link">
                                <a href="classes/SocialStatus.html" data-type="entity-link">SocialStatus</a>
                            </li>
                            <li class="link">
                                <a href="classes/Talon.html" data-type="entity-link">Talon</a>
                            </li>
                            <li class="link">
                                <a href="classes/TalonResponse.html" data-type="entity-link">TalonResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/TalonUniqueNumber.html" data-type="entity-link">TalonUniqueNumber</a>
                            </li>
                            <li class="link">
                                <a href="classes/TerritorialUnit.html" data-type="entity-link">TerritorialUnit</a>
                            </li>
                            <li class="link">
                                <a href="classes/TreatmentMethod.html" data-type="entity-link">TreatmentMethod</a>
                            </li>
                            <li class="link">
                                <a href="classes/VmpStage0.html" data-type="entity-link">VmpStage0</a>
                            </li>
                            <li class="link">
                                <a href="classes/VmpStage1.html" data-type="entity-link">VmpStage1</a>
                            </li>
                            <li class="link">
                                <a href="classes/VmpStage2.html" data-type="entity-link">VmpStage2</a>
                            </li>
                            <li class="link">
                                <a href="classes/VmpStage3.html" data-type="entity-link">VmpStage3</a>
                            </li>
                            <li class="link">
                                <a href="classes/VmpType.html" data-type="entity-link">VmpType</a>
                            </li>
                            <li class="link">
                                <a href="classes/VmpTypeGroup.html" data-type="entity-link">VmpTypeGroup</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/DictionaryService.html" data-type="entity-link">DictionaryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MockService.html" data-type="entity-link">MockService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PatientService.html" data-type="entity-link">PatientService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TalonService.html" data-type="entity-link">TalonService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/ApiWithCredentialInterceptor.html" data-type="entity-link">ApiWithCredentialInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});