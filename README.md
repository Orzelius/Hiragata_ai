# Hiragata_ai

Currently this repo is quite usless due to it having no data, which exist only locally on my pc

## Dev guide
### Warning, getting this to run requires a lot of time and hastle

Reguirements:
| Name | Version |
| ------------- | ------------- |
| [NVIDIA® GPU drivers](https://www.nvidia.com/Download/index.aspx?lang=en-us) | >410.x  |
| [CUDA® Toolkit](https://developer.nvidia.com/cuda-10.0-download-archive)  | 10.0  |
| [cuDNN SDK](https://developer.nvidia.com/rdp/cudnn-download)  | >=7.4.1 but not 8 |

Install packages only after ^
If you get C build errors consult tfjs doc
 
if you get gpu allocation err try running
`export TF_FORCE_GPU_ALLOW_GROWTH=true`
