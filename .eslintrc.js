module.exports = {
    "extends": [
        "react-app",
        "airbnb"
    ],
    "rules" : {
        "indent": "off",
        "space-before-function-paren": "off",
        "react/jsx-indent-props": "off",
        "react/forbid-prop-types": "off",
        "react/no-unused-prop-types": "off",
        "react/jsx-wrap-multilines": "off",
        "react/jsx-closing-bracket-location": "off",
        "react/jsx-indent": "off",
        "comma-dangle": ["error", {
            "arrays": "always-multiline",
            "objects": "always-multiline",
            "imports": "always-multiline",
            "exports": "always-multiline",
            "functions": "never"
        }],
        "max-len": ["error", 200, 4],
        "no-mixed-operators": "off",
        "no-return-assign": ["error", "except-parens"],
        "wrap-iife": "off",
        "no-unused-vars": [2, {"varsIgnorePattern": "_", "argsIgnorePattern": "_"}],
        "react/jsx-filename-extension": [0],
        "arrow-parens": ["error", "as-needed"],
        "import/no-extraneous-dependencies": [0],
        "jsx-a11y/aria-props": 2,
        "jsx-a11y/aria-proptypes": 2,
        "jsx-a11y/aria-role": 2,
        "jsx-a11y/aria-unsupported-elements": 2,
        "jsx-a11y/alt-text": 2,
        "jsx-a11y/img-redundant-alt": 2,
        "jsx-a11y/label-has-for": 2,
        "jsx-a11y/mouse-events-have-key-events": 2,
        "jsx-a11y/no-onchange": 2,
        "jsx-a11y/interactive-supports-focus": 2,
        "jsx-a11y/no-static-element-interactions": 2,
        "jsx-a11y/no-noninteractive-element-interactions": 2,
        "jsx-a11y/role-has-required-aria-props": 2,
        "jsx-a11y/role-supports-aria-props": 2,
        "jsx-a11y/tabindex-no-positive": 2,
        "jsx-a11y/no-noninteractive-tabindex" : "off",
        "linebreak-style": "off",
        "no-bitwise": [ "error", {"allow" : ["^"]} ]
    }
};
