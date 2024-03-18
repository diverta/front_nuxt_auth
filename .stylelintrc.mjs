export default {
    extends: [
        'stylelint-config-standard-scss',
        'stylelint-config-sass-guidelines',
    ],
    "plugins": ["stylelint-order"],
    "rules": {
        "order/order": [
            "custom-properties",
            "declarations"
        ],
        "order/properties-alphabetical-order": true,

        // mitigate strict naming rules
        "selector-id-pattern": null,
        "selector-class-pattern": null,
        "keyframes-name-pattern": null,
        "scss/at-mixin-pattern": null,
        "scss/dollar-variable-pattern": null,
        "scss/percent-placeholder-pattern": null,
    },
    'max-nesting-depth': [
        1,
        {
            ignore: ['pseudo-classes']
        }
    ]
};
