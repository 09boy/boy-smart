const commonPackage = {
	name: 'smart-project-package',
  version: '0.0.1',
  description: 'smart; front-end: webpack development tool;',
  scripts: {
    smart: 'smart',
    start: 'smart start',
    test: 'smart test',
    pre: 'smart build pre',
    release: 'smart build release',
    eslint: 'smart eslint',
    precommit: 'cp pre-commit .git/hooks/'
  },
  keywords: ['smart', 'boy-smart', 'front-framework', 'ES6', 'es6', 'webpack', 'react', 'react-dom', 'react-router-dom',
             'redux', 'react-redux', 'vue', 'vuex'],
  author: '09boy',
  license: 'ISC',
  homepage: 'https://github.com/09boy/boy-smart',
  repository: {
    type: 'git',
    url: 'https://github.com/09boy/boy-smart.git'
  },
  bugs: 'https://github.com/09boy/boy-smart/issues'
};

const smartPackage = {
  normal: (obj = {}) => Object.assign({}, commonPackage, obj/*, {
    dependencies: {
    }
  }*/),
  react: (obj = {}) =>  Object.assign({}, commonPackage, obj, {
  	dependencies: {
      "history": "^4.6.3",
      "js-cookie": "^2.1.4",
      "prop-types": "^15.5.10",
      "react": "^15.6.1",
      "react-dom": "^15.6.1",
      "react-redux": "^5.0.5",
      "react-router-dom": "^4.1.2",
      "react-router-redux": "^5.0.0-alpha.6",
      "redux": "^3.7.2",
      "redux-logger": "^3.0.6",
      "redux-thunk": "^2.2.0",
      "reselect": "^3.0.1",
      "store": "^2.0.12"
	  },
  }),
  vue: (obj = {}) => Object.assign({}, commonPackage, obj, {
  	dependencies: {
      "vue": "^2.4.2",
      "vue-router": "^2.7.0",
      "vuex": "^2.4.0"
    },

    devDependencies: {
      "vue-hot-reload-api": "^2.1.0"
    }
  }),
};

const page = {
	normal: (option) => {
    return '';
  },

	react: (option) => {
    const { name, uName } = option;
    return {
      index: [
        `import './style';`,
        `import connect from 'utils/connect';`,
        `import selector from './redux/selector';`,
        `import * as actions from './redux/actions';\n`,
        '@connect(selector, actions)',
        `export default class ${uName}Page extends React.Component {\n`,

        '\trender() {',
        '\t\treturn (',
        `\t\t\t<div className='page-container'>`,
        `\t\t\t\t<h2>${uName} page is created.</h2>`,
        '\t\t\t</div>',
        '\t\t);',
        '\t}',
        '}',
      ].join('\n'),

      selector: [
        `import { createSelector } from 'reselect';\n`,

        '// write your code instead of the following code',
        `const get${uName}State = state => state.${name};\n`,

        'export default createSelector(',
        `\tget${uName}State,`,

        '\t(data) => {',
        '\t\t// parse the data\n',

        '\t\treturn {',
        '\t\t\tdata',
        '\t\t}',
        '\t}',
        ')',
      ].join('\n'),

      reducer: [
        `const ${name} = (state = {}, action) => {`,
        '\tswitch (action.type) {',
        `\t\t// write your code, here.`,
        `\t\t\t// case 'FETCH_DATA':`,
        `\t\t\t\t// return {...state, message: 'fetch home data'};`,
        '\t\tdefault:',
        '\t\t\treturn state;',
        '\t}',
        '};\n',

        `export default ${name};`
      ].join('\n'),

      actions: [
        '// sample',
        '/*const receiveData = (data) => ({',
        `\ttype: 'FETCH_DATA',`,
        '\t...data',
        '});\n',

        'export const fetchData = (params) => {',
        '\treturn (dispatch) => {',
        '\t\tdispatch(receiveData(params));',
        '\t}',
        '};*/'

      ].join('\n'),
    };
  },

	vue: (option) => {
    const { name, uName } = option;

    return {
      index: [
        '<template>',
        '\t<div class="page">',
        `\t\t<h2>${uName} page is created.</h2>`,
        '\t</div>',
        '</template>',
        '<script>',
        '// import {mapActions, mapMutations, mapGetters} from vuex',
        '\texport default{',
        '\t\tdata() {',
        '\t\t\t return {};',
        '\t\t},',
        '\t\tcomputed: {},',
        '\t\tmethods: {},',
        '\t}',
        '</script>',
        '<style land="scss">',
        '</style>'
      ].join('\n'),

      localModule: [
        '// 关于 actionTypes 可以单独放在一个独立文件内，根据需求自己定',
        'export default {',
        '\tstate: {},',
        '\tmutations: {},',
        '\tactions: {},',
        '\tgetters: {},',
        '}',
      ].join('\n'),
    };
  },
};

// const commonComponent = {

// };

const component = {
	normal: (option) => {
    return '';
  },

	react: (option) => {
    const { name, uName } = option;

    return {
      index: [
        `import './style';\n`,
        `export default class ${uName} extends React.Component {\n`,

        '\trender() {',
        '\t\treturn (',
        `\t\t\t<div className='${uName}_Component'>`,
        `\t\t\t\t<h2>${uName} Component is created.</h2>`,
        '\t\t\t</div>',
        '\t\t);',
        '\t}',
        '}',
      ].join('\n'),

      style: [
        `.${uName}_Component {}`
      ].join('\n'),
    }
  },

	vue: (option) => {
    const { name, uName } = option;

    return {
      index: [
        '<template>',
        `\t<div class='${uName}_Component'>`,
        '\t</div>',
        '</template>',
        '<script>',
        '\t\texport default{',
        '\t\t\tdata: {},',
        '\t\t\tcomputed: {},',
        '\t\t\tmethods: {},',
        '\t\t}',
        '</script>',
        '<style land="scss">',
        '</style>'
      ].join('\n'),
    };
  },
};

module.exports = {
	installPackage: smartPackage,
	page,
	component,
};
