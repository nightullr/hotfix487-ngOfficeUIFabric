﻿'use strict';

import * as angular from 'angular';
import { ChoicefieldType } from './choicefieldTypeEnum';

describe('choicefieldDirective <uif-choicefield />', () => {
  beforeEach(() => {
    angular.mock.module('officeuifabric.components.choicefield');
  });

  it('should render correct html', inject(($compile: Function, $rootScope: angular.IRootScopeService) => {
    let $scope: any = $rootScope.$new();

    let choicefield: JQuery = $compile('<uif-choicefield-group ng-model="selectedValue">' +
      '<uif-choicefield-group-title><label class="ms-Label is-required">Pick a value</label></uif-choicefield-group-title>' +
      '<uif-choicefield-option uif-type="radio" value="value1">Text 1</uif-choicefield-option>' +
      '<uif-choicefield-option uif-type="radio" value="value2">Text 2</uif-choicefield-option>' +
      '<uif-choicefield-option uif-type="radio" value="value3">Text 3</uif-choicefield-option>' +
      '<uif-choicefield-option uif-type="radio" value="value4">Text 4</uif-choicefield-option>' +
      '</uif-choicefield>')($scope);
    $scope.$digest();
    choicefield = jQuery(choicefield[0]);
    let container: JQuery = choicefield.find('div.ms-ChoiceFieldGroup');

    expect(container.length).toBe(1, 'Container should be present');

    let items: JQuery = choicefield.find('input');
    expect(items.length).toBe(4, 'There should be 4 inputs');

    let titleLabel: JQuery = choicefield.find('.ms-ChoiceFieldGroup-title label.ms-Label');
    expect(titleLabel.html()).toBe('Pick a value');

    let input1: JQuery = jQuery(items[0]);
    expect(input1.attr('type')).toBe('radio', 'Type should be radio');

    let span1: JQuery = container.find('label[for="' + input1.attr('id') + '"] span');
    expect(span1.html()).toBe('Text 1', 'Label should be Text 1');
  }));

  it('should be able to set options', inject(($compile: Function, $rootScope: angular.IRootScopeService) => {
    let $scope: any = $rootScope.$new();
    $scope.selectedValue = 'value2';
    let choicefield: JQuery = $compile('<uif-choicefield-group ng-model="selectedValue">' +
      '<uif-choicefield-option uif-type="radio" value="value1">Text 1</uif-choicefield-option>' +
      '<uif-choicefield-option uif-type="radio" value="value2">Text 2</uif-choicefield-option>' +
      '<uif-choicefield-option uif-type="radio" value="value3">Text 3</uif-choicefield-option>' +
      '<uif-choicefield-option uif-type="radio" value="value4">Text 4</uif-choicefield-option>' +
      '</uif-choicefield-group>')($scope);
    $scope.$digest();
    choicefield = jQuery(choicefield[0]);

    let input2 = jQuery(choicefield.find('input')[1]);
    expect(input2.prop('checked')).toBe(true, 'Input 2 (value2) should be checked');

    let input3: JQuery = jQuery(choicefield.find('input')[2]);
    expect(input3.attr('checked')).not.toBe('checked', 'Other inputs should not be checked.');
  }));

  it('should be able to select an option in a group', inject(($compile: Function, $rootScope: angular.IRootScopeService) => {
    let $scope: any = $rootScope.$new();
    $scope.options = [
      { text: 'Option 1', value: 'Option1' },
      { text: 'Option 2', value: 'Option2' },
      { text: 'Option 3', value: 'Option3' },
      { text: 'Option 4', value: 'Option4' }
    ];
    $scope.selectedValue = 'Option1';

    let choicefield: JQuery = $compile('<uif-choicefield-group ng-model="selectedValue">' +
      '<uif-choicefield-option uif-type="radio" ng-repeat="option in options" ' +
      'value="{{option.value}}">{{option.text}}</uif-choicefield-option></uif-choicefield-group>')($scope);
    $scope.$digest();
    choicefield = jQuery(choicefield[0]);
    choicefield.appendTo(document.body);
    let option1: JQuery = jQuery(choicefield.find('input')[0]);
    let option3: JQuery = jQuery(choicefield.find('input')[2]);

    expect(option1.prop('checked')).toBe(true, 'Option 1 - Checked should be true before click');
    option3.click();
    expect(option3.prop('checked')).toBe(true, 'Option 3 - Checked should be true after click');
    expect(option1.prop('checked')).toBe(false, 'Option 1 - Checked should be false after click');
    expect($scope.selectedValue).toBe('Option3', 'Scope value should be option3 now as it is a radio button group');
  }));

  it('should be able to use ng-change', inject(($compile: Function, $rootScope: angular.IRootScopeService) => {
    let $scope: any = $rootScope.$new();
    $scope.options = [
      { text: 'Option 1', value: 'Option1' },
      { text: 'Option 2', value: 'Option2' },
      { text: 'Option 3', value: 'Option3' },
      { text: 'Option 4', value: 'Option4' }
    ];
    $scope.selectedValue = 'Option1';
    $scope.ngChange = () => {
      $scope.ngChangeCalled = true;
    };
    $scope.ngChangeCalled = false;
    let choicefield: JQuery = $compile('<uif-choicefield-group ng-model="selectedValue" ng-change="ngChange()">' +
      '<uif-choicefield-option uif-type="radio" ng-repeat="option in options" ' +
      'value="{{option.value}}">{{option.text}}</uif-choicefield-option></uif-choicefield-group>')($scope);
    $scope.$digest();
    choicefield = jQuery(choicefield[0]);
    choicefield.appendTo(document.body);
    expect($scope.ngChangeCalled).toBe(false, 'ngChangeCalled should be false initially');
    let option3: JQuery = jQuery(choicefield.find('input')[2]);
    option3.click();
    expect($scope.ngChangeCalled).toBe(true, 'ngChangeCalled should be true after option click');
  }));

  it('should be able to select a single option', inject(($compile: Function, $rootScope: angular.IRootScopeService) => {
    let $scope: any = $rootScope.$new();
    $scope.selectedValue = '';

    let choicefield: JQuery = $compile('<uif-choicefield-option uif-type="checkbox" value="Option1"' +
      'ng-model="selectedValue" ng-true-value="\'TRUEVALUE\'" ng-false-value="\'FALSEVALUE\'">Option 1uif-choicefield-option>')($scope);
    $scope.$digest();
    choicefield = jQuery(choicefield[0]);

    let input: JQuery = choicefield.find('input');
    input.click();

    expect(input.prop('checked')).toBe(true, 'Input should be checked after click');
    expect($scope.selectedValue).toBe('TRUEVALUE', 'ng model should be "TRUEVALUE"');
  }));

  it('should be able to select multiple options in a group', inject(($compile: Function, $rootScope: angular.IRootScopeService) => {
    let $scope: any = $rootScope.$new();
    $scope.selectedValue;

    let choicefield: JQuery = $compile('<uif-choicefield-group ng-model="selectedValue"><uif-choicefield-option uif-type="checkbox" value="Option1"' +
      '>Option 1</uif-choicefield-option><uif-choicefield-option uif-type="checkbox" value="Option2">Option 2</uif-choicefield-option></uif-choicefield-group>')($scope);
    $scope.$digest();
    choicefield = jQuery(choicefield[0]);
    choicefield.appendTo(document.body);
    let option1: JQuery = jQuery(choicefield.find('input')[0]);
    let option2: JQuery = jQuery(choicefield.find('input')[1]);
    
    option1.click();
    expect(option1.prop('checked')).toBe(true, 'Input 1 should be checked after click');
    
    option2.click();
    expect(option2.prop('checked')).toBe(true, 'Input 2 should be checked after click');
    expect(option1.prop('checked')).toBe(true, 'Input 1 should still be checked after input 2 click');
    
    expect($scope.selectedValue).toEqual(['Option1', 'Option2'], 'ng model should be an array with two items');
  }));

  it('should be validating attributes', inject(($compile: Function, $rootScope: angular.IRootScopeService, $log: angular.ILogService) => {
    let $scope: any = $rootScope.$new();
    $scope.selectedValue = 'Option1';

    expect($log.error.logs.length).toBe(0);
    $compile('<uif-choicefield-option uif-type="invalid" value="Option1"' +
      'ng-model="selectedValue">Option 1</uif-choicefield-option>')($scope);
    $scope.$digest();

    expect($log.error.logs[0]).toContain('Error [ngOfficeUiFabric] officeuifabric.components.choicefield - ' +
      '"invalid" is not a valid value for uifType. ' +
      'Supported options are listed here: ' +
      'https://github.com/ngOfficeUIFabric/ng-officeuifabric/blob/master/src/components/choicefield/choicefieldTypeEnum.ts');
  }));

  it('should be able to disable an select', inject(($compile: Function, $rootScope: angular.IRootScopeService) => {
    let $scope: any = $rootScope.$new();
    $scope.options = [
      { text: 'Option 1', value: 'Option1' },
      { text: 'Option 2', value: 'Option2' },
      { text: 'Option 3', value: 'Option3' },
      { text: 'Option 4', value: 'Option4' }
    ];
    $scope.selectedValue = 'Option1';
    $scope.disabled = true;
    $scope.disabledChild = false;

    let choicefield: JQuery = $compile('<uif-choicefield-group ng-model="selectedValue" ng-disabled="disabled">' +
      '<uif-choicefield-option uif-type="radio" ng-repeat="option in options" ng-disabled="disabledChild" ' +
      'value="{{option.value}}">{{option.text}}</uif-choicefield-option></uif-choicefield-group>')($scope);
    $scope.$digest();
    choicefield = jQuery(choicefield[0]);
    choicefield.appendTo(document.body);

    let option1: JQuery = jQuery(choicefield.find('input')[0]);
    let option3: JQuery = jQuery(choicefield.find('input')[2]);

    expect(!!option1.attr('disabled')).toBe(true, 'Option 1 should be disabled');
    expect(!!option3.attr('disabled')).toBe(true, 'Option 3 should be disabled');

    option3.click();
    expect(option3.prop('checked')).toBe(false, 'Option 3 - Checked should be false after click as parent element is disabled');
    expect(option1.prop('checked')).toBe(true, 'Option 1 - Checked should still be true after click as parent element is disabled');

    $scope.disabled = false;
    $scope.disabledChild = true;
    $scope.$digest();

    option3.click();
    expect(option3.prop('checked')).toBe(false, 'Option 3 - Checked should be false after click as child element is disabled');
    expect(option1.prop('checked')).toBe(true, 'Option 1 - Checked should still be true after click as child element is disabled');

    $scope.disabled = false;
    $scope.disabledChild = false;
    $scope.$digest();

    option3.click();
    expect(option3.prop('checked')).toBe(true, 'Option 3 - Checked should be true after click as element is not disabled');
    expect(option1.prop('checked')).toBe(false, 'Option 1 - Checked should be false after click as element is not disabled');
  }));

  it(
    'should set $dirty & $touched on ng-model when value changed',
    inject(($compile: Function, $rootScope: angular.IRootScopeService) => {
      let $scope: any = $rootScope.$new();
      $scope.options = [
        { text: 'Option 1', value: 'Option1' },
        { text: 'Option 2', value: 'Option2' },
        { text: 'Option 3', value: 'Option3' },
        { text: 'Option 4', value: 'Option4' }
      ];
      $scope.selectedValue = 'Option1';

      let choicefield: JQuery = $compile('<uif-choicefield-group ng-model="selectedValue" ng-disabled="disabled" uif-type="radio">' +
        '<uif-choicefield-option ng-repeat="option in options" ng-disabled="disabledChild" ' +
        'value="{{option.value}}">{{option.text}}</uif-choicefield-option></uif-choicefield-group>')($scope);

      choicefield = jQuery(choicefield[0]);
      choicefield.appendTo(document.body);

      $scope.$digest();

      let option3: JQuery = jQuery(choicefield.find('input')[2]);

      option3.click();

      let ngModel: angular.INgModelController = angular.element(choicefield).controller('ngModel');

      expect($scope.selectedValue).toBe('Option3');
      expect(ngModel.$dirty).toBeTruthy();
      expect(ngModel.$touched).toBeTruthy();
    }));

  it(
    'should set $touched when value not changed & option clicked',
    inject(($compile: Function, $rootScope: angular.IRootScopeService) => {
      let $scope: any = $rootScope.$new();
      $scope.options = [
        { text: 'Option 1', value: 'Option1' },
        { text: 'Option 2', value: 'Option2' },
        { text: 'Option 3', value: 'Option3' },
        { text: 'Option 4', value: 'Option4' }
      ];
      $scope.selectedValue = 'Option3';

      let choicefield: JQuery = $compile('<uif-choicefield-group ng-model="selectedValue" ng-disabled="disabled" uif-type="radio">' +
        '<uif-choicefield-option ng-repeat="option in options" ng-disabled="disabledChild" ' +
        'value="{{option.value}}">{{option.text}}</uif-choicefield-option></uif-choicefield-group>')($scope);

      choicefield = jQuery(choicefield[0]);
      choicefield.appendTo(document.body);

      $scope.$digest();

      let option3: JQuery = jQuery(choicefield.find('input')[2]);

      option3.click();

      let ngModel: angular.INgModelController = angular.element(choicefield).controller('ngModel');

      expect($scope.selectedValue).toBe('Option3');
      expect(ngModel.$dirty).toBeFalsy();
      expect(ngModel.$touched).toBeTruthy();
    }));

  it(
    'should be validating presence of ng-model when value is changed',
    inject(($compile: Function, $rootScope: angular.IRootScopeService) => {
      let $scope: any = $rootScope.$new();
      $scope.options = [
        { text: 'Option 1', value: 'Option1' },
        { text: 'Option 2', value: 'Option2' },
        { text: 'Option 3', value: 'Option3' },
        { text: 'Option 4', value: 'Option4' }
      ];

      let choicefield: JQuery = $compile('<uif-choicefield-group ng-disabled="disabled" uif-type="radio">' +
        '<uif-choicefield-option ng-repeat="option in options" ng-disabled="disabledChild" ' +
        'value="{{option.value}}">{{option.text}}</uif-choicefield-option></uif-choicefield-group>')($scope);

      choicefield = jQuery(choicefield[0]);
      choicefield.appendTo(document.body);

      $scope.$digest();

      let option3: JQuery = jQuery(choicefield.find('input')[2]);

      option3.click();

      let ngModel: angular.INgModelController = angular.element(choicefield).controller('ngModel');
      expect(ngModel).toBeUndefined();
    }));

  it('should not set $dirty & $touched on ng-model intially', inject(($compile: Function, $rootScope: angular.IRootScopeService) => {
    let $scope: any = $rootScope.$new();
    $scope.options = [
      { text: 'Option 1', value: 'Option1' },
      { text: 'Option 2', value: 'Option2' },
      { text: 'Option 3', value: 'Option3' },
      { text: 'Option 4', value: 'Option4' }
    ];
    $scope.selectedValue = 'Option1';

    let choicefield: JQuery = $compile('<uif-choicefield-group ng-model="selectedValue" ng-disabled="disabled" uif-type="radio">' +
      '<uif-choicefield-option ng-repeat="option in options" ng-disabled="disabledChild" ' +
      'value="{{option.value}}">{{option.text}}</uif-choicefield-option></uif-choicefield-group>')($scope);

    choicefield = jQuery(choicefield[0]);
    choicefield.appendTo(document.body);

    $scope.$digest();

    let ngModel: angular.INgModelController = angular.element(choicefield).controller('ngModel');

    expect(ngModel.$dirty).toBeFalsy();
    expect(ngModel.$touched).toBeFalsy();
  }));

  /**
   * Verify the field responds to changes in the uif-type attribute.
   */
  it(
    'should allow to interpolate uif-type value',
    inject((
      $compile: angular.ICompileService,
      $rootScope: angular.IRootScopeService) => {

      let inputElement: JQuery = null;
      let scope: any = $rootScope.$new();
      let html: string =
        `<uif-choicefield-group>
          <uif-choicefield-option uif-type="{{type}}" value="value1">value1</uif-choicefield-option>
         </uif-choicefield-group>`;
      let element: JQuery = angular.element(html);

      let choiceType: string = '';

      $compile(element)(scope);

      // >>> test 1
      // set to one icon in scope
      choiceType = ChoicefieldType[ChoicefieldType.radio];
      scope.type = choiceType;

      // run digest cycle
      scope.$digest();
      element = jQuery(element[0]);

      // test correct icon is used
      inputElement = element.find('input');
      expect(inputElement.attr('type')).toBe(choiceType);


      // >>> test 2
      // change icon type in scope
      choiceType = ChoicefieldType[ChoicefieldType.checkbox];
      scope.type = choiceType;

      // run digest cycle
      scope.$digest();
      element = jQuery(element[0]);

      // test that new type is there
      inputElement = element.find('input');
      expect(inputElement.attr('type')).toBe(choiceType);
    })
  );

});
