import * as angular from 'angular';

import { ChoicefieldType } from './choicefieldTypeEnum';

/**
 * @ngdoc interface
 * @name IChoicefieldOptionScope
 * @module officeuifabric.components.choicefield
 *
 * @description
 * This is the scope used by the choicefield option directive.
 *
 *
 * @property {string=} ngModel           - Set the ng-model
 * @property {string=} ngTrueValue       - Set the ng-true-value. Can only be used with checkbox
 * @property {string=} ngFalseValue      - Set the ng-false-value. Can only be used with checkbox
 * @property {boolean=} disabled         - Set to disable the element
 * @property {choicefieldType=} uifType  - Radio or Checkbox
 */
export interface IChoicefieldOptionScope extends angular.IScope {
  ngModel: angular.INgModelController;
  ngTrueValue: string;
  ngFalseValue: string;
  disabled: boolean;
  uifType: ChoicefieldType;
}

/**
 * @ngdoc interface
 * @name IChoicefieldGroupScope
 * @module officeuifabric.components.choicefield
 *
 * @description
 * This is the scope used by the choicefield group directive.
 *
 *
 * @property {string=} ngModel     - Set the ng-model
 * @property {boolean=} disabled   - Set to disable the element
 */
export interface IChoicefieldGroupScope extends angular.IScope {
  ngModel: angular.INgModelController;
  disabled: boolean;
}
/**
 * @ngdoc class
 * @name ChoicefieldOptionController
 * @module  officeuifabric.components.choicefield
 *
 * @description
 * This is the controller for the <uif-choicefield-option> directive
 */
export class ChoicefieldOptionController {
  public static $inject: string[] = ['$log'];
  constructor(public $log: angular.ILogService) { }
}

/**
 * @ngdoc directive
 * @name uifChoicefieldOption
 * @module officeuifabric.components.choicefield
 *
 * @restrict E
 *
 * @description
 * `<uif-choicefield-option>` is an option directive (radio or checkbox)
 * Can be used in uif-choicefield-group, or as a single element
 *
 * @usage
 *
 * <uif-choicefield-option uif-type="checkbox" value="Option1"
 *      ng-model="selectedValue" ng-true-value="\'TRUEVALUE\'" ng-false-value="\'FALSEVALUE\'">Option 1</uif-choicefield>
 */
export class ChoicefieldOptionDirective implements angular.IDirective {
  public template: string = '<div class="ms-ChoiceField">' +
  '<input id="{{::$id}}" class="ms-ChoiceField-input" type="{{uifType}}" value="{{value}}" ng-disabled="disabled"  ' +
  'ng-model="ngModel" ng-true-value="{{ngTrueValue}}" ng-false-value="{{ngFalseValue}}" />' +
  '<label for="{{::$id}}" class="ms-ChoiceField-field"><span class="ms-Label" ng-transclude></span></label>' +
  '</div>';
  public restrict: string = 'E';
  public require: string[] = ['uifChoicefieldOption', '^?uifChoicefieldGroup'];
  public replace: boolean = true;
  public transclude: boolean = true;
  public scope: {} = {
    ngFalseValue: '@',
    ngModel: '=',
    ngTrueValue: '@',
    uifType: '@',
    value: '@'
  };
  public controller: typeof ChoicefieldOptionController = ChoicefieldOptionController;

  public static factory(): angular.IDirectiveFactory {
    const directive: angular.IDirectiveFactory = () =>
      new ChoicefieldOptionDirective();

    return directive;
  }

  public compile(
    templateElement: angular.IAugmentedJQuery,
    templateAttributes: angular.IAttributes,
    transclude: angular.ITranscludeFunction): angular.IDirectivePrePost {
    let input: angular.IAugmentedJQuery = templateElement.find('input');
    if (!('ngModel' in templateAttributes)) {
      // remove ng-model, as this is an optional attribute.
      // if not removed, this will have unwanted side effects
      input.removeAttr('ng-model');
    }
    return {
      pre: this.preLink
    };
  }

  private preLink(
    scope: IChoicefieldOptionScope,
    instanceElement: angular.IAugmentedJQuery,
    attrs: any,
    ctrls: any[],
    transclude: angular.ITranscludeFunction): void {
    let choicefieldOptionController: ChoicefieldOptionController = ctrls[0];
    let choicefieldGroupController: ChoicefieldGroupController = ctrls[1];
    scope.$watch('uifType', (newValue: string, oldValue: string) => {
      if (ChoicefieldType[newValue] === undefined) {
        choicefieldOptionController.$log.error('Error [ngOfficeUiFabric] officeuifabric.components.choicefield - "' +
          newValue + '" is not a valid value for uifType. ' +
          'Supported options are listed here: ' +
          'https://github.com/ngOfficeUIFabric/ng-officeuifabric/blob/master/src/components/choicefield/choicefieldTypeEnum.ts');
      }
      if (choicefieldGroupController != null) {
        let modelValue: any = choicefieldGroupController.getViewValue();
        if (newValue === 'radio' && modelValue && modelValue.constructor === Array) {
          choicefieldGroupController.setViewValue(modelValue[0], null);
        }
        if (newValue === 'checkbox' && modelValue && modelValue.constructor === String) {
          choicefieldGroupController.setViewValue([modelValue], null);
        }
      }
    });
    if (choicefieldGroupController != null) {
      let render: () => void = (): void => {
        let checked: boolean;
        if (attrs.uifType == 'checkbox') {
          checked = (choicefieldGroupController.getViewValue() && choicefieldGroupController.getViewValue().indexOf(attrs.value) > -1);
        }
        if (attrs.uifType == 'radio') {
          checked = (choicefieldGroupController.getViewValue() === attrs.value);
        }
        instanceElement.find('input').prop('checked', checked);
      };
      choicefieldGroupController.addRender(render);
      attrs.$observe('value', render);
      instanceElement
        .on('$destroy', function (): void {
          choicefieldGroupController.removeRender(render);
        });
    }

    let parentScope: IChoicefieldGroupScope = <IChoicefieldGroupScope>scope.$parent.$parent;
    let checkDisabled: () => void = () => {
      scope.disabled = 'disabled' in attrs && attrs.disabled;
      scope.disabled = scope.disabled || (parentScope != null && parentScope.disabled);
    };
    scope.$watch(
      () => { return instanceElement.attr('disabled'); },
      ((newValue) => {
        checkDisabled();
      }));
    scope.$watch(
      () => { return parentScope == null ? '' : parentScope.disabled; },
      ((newValue) => { checkDisabled(); }));

    checkDisabled();
    instanceElement
      .on('click', (ev: JQueryEventObject) => {
        if (scope.disabled) {
          return;
        }
        if (choicefieldGroupController != null) {
          choicefieldGroupController.setTouched();
        }
        scope.$apply(() => {
          if (choicefieldGroupController != null) {
            if (attrs.uifType == 'checkbox' && ev.target.tagName.toLowerCase() == 'input') {
              let checked: boolean = instanceElement.find('input').prop('checked');
              let newViewValue: any = choicefieldGroupController.getViewValue();              
              if (newViewValue && newViewValue.constructor === Array) {
                if (checked) {
                  newViewValue.push(attrs.value);
                }
                else {
                  newViewValue.splice(newViewValue.indexOf(attrs.value), 1);
                }
              }
              else {
                if (checked){
                  newViewValue = !!newViewValue ? [newViewValue, attrs.value] : [attrs.value];
                }
              }
              choicefieldGroupController.setViewValue(newViewValue, ev);
            }
            if (attrs.uifType == 'radio') {
              choicefieldGroupController.setViewValue(attrs.value, ev);
            }
          }
        });
      });
  }
}

/**
 * @ngdoc directive
 * @name uifChoicefieldGroupTitle
 * @module officeuifabric.components.choicefield
 *
 * @restrict E
 *
 * @description
 * `<uif-choicefield-group-title>` is a choicefield group title directive
 * to render the title component of a choicefield group
 */

export class ChoicefieldGroupTitleDirective implements angular.IDirective {
  public template: string = '<div class="ms-ChoiceFieldGroup-title"><ng-transclude /></div>';
  public transclude: boolean = true;
  public static factory(): angular.IDirectiveFactory {
    const directive: angular.IDirectiveFactory = () => new ChoicefieldGroupTitleDirective();
    return directive;
  }
}


/**
 * @ngdoc class
 * @name ChoicefieldgroupController
 * @module officeuifabric.components.choicefield
 *
 * @restrict E
 *
 * @description
 * ChoicefieldGroupController is the controller for the <uif-choicefield-group> directive
 *
 */
export class ChoicefieldGroupController {
  public static $inject: string[] = ['$element', '$scope'];

  private renderFns: Function[] = [];

  public constructor(public $element: JQuery, public $scope: IChoicefieldGroupScope) {
  }

  public init(): void {
    if (typeof this.$scope.ngModel !== 'undefined' && this.$scope.ngModel != null) {
      this.$scope.ngModel.$render = () => {
        this.render();
      };
      this.render();
    }
  }

  public addRender(fn: Function): void {
    this.renderFns.push(fn);
  }

  public removeRender(fn: Function): void {
    this.renderFns.splice(this.renderFns.indexOf(fn));
  }

  public setViewValue(value: any, eventType: any): void {
    if (typeof this.$scope.ngModel !== 'undefined' && this.$scope.ngModel != null) {
      if (this.getViewValue() !== value) {
        this.$scope.ngModel.$setDirty();
      }
      this.$scope.ngModel.$setViewValue(value, eventType);
      this.render(); // update all inputs checked/not checked
    }
  }

  public setTouched(): void {
    if (typeof this.$scope.ngModel !== 'undefined' && this.$scope.ngModel != null) {
      this.$scope.ngModel.$setTouched();
    }
  }

  public getViewValue(): any {
    if (typeof this.$scope.ngModel !== 'undefined' && this.$scope.ngModel != null) {
      return this.$scope.ngModel.$viewValue;
    }
  }

  private render(): void {
    for (let i: number = 0; i < this.renderFns.length; i++) {
      this.renderFns[i]();
    }
  }
}

/**
 * @ngdoc directive
 * @name uifChoicefieldGroup
 * @module officeuifabric.components.choicefield
 *
 * @restrict E
 *
 * @description
 * `<uif-choicefield>` is a choicefield directive
 * @see https://github.com/OfficeDev/Office-UI-Fabric/tree/master/src/components/Choicefield
 *
 * @usage
 *
 * <uif-choicefield-group ng-model="selectedValue">
 *    <uif-choicefield-group-title><label class="ms-Label is-required">Pick one</label></uif-choicefield-group-title>
 *    <uif-choicefield-option uif-type="radio" ng-repeat="option in options"
 *        value="{{option.value}}">{{option.text}}</uif-choicefield-option>
 * </uif-choicefield-group>
 */
export class ChoicefieldGroupDirective implements angular.IDirective {
  public template: string =
  '<div class="ms-ChoiceFieldGroup">' +
  '<ng-transclude />' +
  '</div>';

  public restrict: string = 'E';
  public transclude: boolean = true;
  public require: string[] = ['uifChoicefieldGroup', '?ngModel'];
  public controller: typeof ChoicefieldGroupController = ChoicefieldGroupController;

  // make sure we have an isolate scope
  public scope: {} = {};

  public static factory(): angular.IDirectiveFactory {
    const directive: angular.IDirectiveFactory = () => new ChoicefieldGroupDirective();
    return directive;
  }
  public compile(
    templateElement: angular.IAugmentedJQuery,
    templateAttributes: angular.IAttributes,
    transclude: angular.ITranscludeFunction): angular.IDirectivePrePost {
    return {
      pre: this.preLink
    };
  }

  private preLink(
    scope: IChoicefieldGroupScope,
    instanceElement: angular.IAugmentedJQuery,
    instanceAttributes: angular.IAttributes,
    ctrls: {}): void {
    let choicefieldGroupController: ChoicefieldGroupController = ctrls[0];
    let modelController: angular.INgModelController = ctrls[1];
    scope.ngModel = modelController;
    choicefieldGroupController.init();

    scope.$watch(
      () => { return instanceElement.attr('disabled'); },
      ((newValue) => { scope.disabled = typeof newValue !== 'undefined'; }));
    scope.disabled = 'disabled' in instanceAttributes;
  }
}

/**
 * @ngdoc module
 * @name officeuifabric.components.choicefield
 *
 * @description
 * ChoiceField
 *
 */
export let module: angular.IModule = angular.module('officeuifabric.components.choicefield', [
  'officeuifabric.components'
])
  .directive('uifChoicefieldOption', ChoicefieldOptionDirective.factory())
  .directive('uifChoicefieldGroup', ChoicefieldGroupDirective.factory())
  .directive('uifChoicefieldGroupTitle', ChoicefieldGroupTitleDirective.factory());
