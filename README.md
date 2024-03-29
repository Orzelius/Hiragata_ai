# Hiragata_ai

The AI model that is used in [hiragata.com](https://hiragata.com/).

**This repo is part of the Hiragata project** Links to other parts of the project:
| Repo | Description |
| ------------- | ------------- |
| [Hiragata](https://github.com/Orzelius/Hiragata) | React based front-end |
| [Hiragata_ai](https://github.com/Orzelius/Hiragata_ai) | Source code of the AI model |
| [test-hiragata-ai](https://github.com/Orzelius/test-hiragata-ai) | AI model testing and visualization react based FE |
| [japanese-fonts-dataset](https://github.com/Orzelius/japanese-fonts-dataset)  | Source for a small font-based dataset |

## Dev guide

### I want to work with the data only (no model training)

1. Clone the repo
2. Change working directory to the repo root (`cd Hiragata_ai`)
3. Download some model-ready data from [Google Drive](https://drive.google.com/file/d/13nL7qlIiph2Ok4lOz5mcxD5KC__8jozf/view?usp=sharing)
4. Extract data to `data/bin/` (Final result should be something like `data/bin/48x48/binary_files_located_here`)
5. Install npm packages `npm ci` (It's fine if tfjs build fails as you won't need it if you're only working with data. Most of tfjs will still work as it will fallback to the js version if you don't have the GPU stuff working)
6. Create dir for test-images `mkdir test-images`
7. Run `npm run init-data` to create some images into `/test-images` and test if everything works
8. Great success!

### I want to work with the model

NOTE: everything will work with the js-node version of tfjs, but if you want to greatly accelerate the learning you could try to get the GPU stuff working

#### How to get tfjs-gpu to work

Reguirements:
The hardware and software requirements are the same as regular tensorflow. You can use [this](https://www.tensorflow.org/install/gpu#hardware_requirements) quide to get deps working.
| Name | Version |
| ------------- | ------------- |
| [NVIDIA® GPU drivers](https://www.nvidia.com/Download/index.aspx?lang=en-us) | >410.x  |
| [CUDA® Toolkit](https://developer.nvidia.com/cuda-10.0-download-archive)  | 10.0  |
| [cuDNN SDK](https://developer.nvidia.com/rdp/cudnn-download)  | >=7.4.1 but not 8 |

Install packages only after ^

If you get C build errors on windows consult [tfjs doc](https://github.com/tensorflow/tfjs/blob/master/tfjs-node/WINDOWS_TROUBLESHOOTING.md#msbuildexe-exceptions)
 
if you get gpu allocation err try running
`export TF_FORCE_GPU_ALLOW_GROWTH=true`

## Data

TODO: document this section

The model-ready data can be found from [Google Drive](https://drive.google.com/drive/folders/1VZO4YAlFP1xegt1BvoKUMDOY_9Nm3p-b?usp=sharing)
